// MyJobsViewList.tsx
// ChatGPT assisted with this component
// 40% human written, 60% Copilot generated

import { useEffect, useMemo, useState, useCallback } from 'react';
import SavedAppliedJobCard from './SavedAppliedJobCard';
import type { SavedAppliedJob } from '../../api/pages/myJobs';
import {
  getMySaved,
  getMyApplied,
  deleteSavedJob,
  deleteAppliedJob,
  deleteAllSaved,
  deleteAllApplied,
} from '../../api/pages/myJobs';
import DeleteButton from '../buttons/Delete';
import DeleteAll from '../buttons/DeleteAll';

const LG_QUERY = '(min-width: 992px)';

// Helper function to transform job types according to business rules
const transformJobType = (type: string | undefined): string => {
  if (!type) return 'Unknown';

  const normalizedType = type.trim();

  if (normalizedType === 'Regular Full-Time') return 'Office';
  if (normalizedType === 'Full-Time') return 'Home';
  if (normalizedType === 'Hybrid') return 'Hybrid';

  return 'Unknown';
};

interface MyJobsViewListProps {
  view: 'saved' | 'applied';
  onChangeView?: (v: 'saved' | 'applied') => void;
}

const MyJobsViewList: React.FC<MyJobsViewListProps> = ({
  view,
  onChangeView,
}) => {
  const [jobs, setJobs] = useState<SavedAppliedJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLgUp, setIsLgUp] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(LG_QUERY).matches : true
  );

  // Add CSS for fadeIn animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Watch for screen size changes (desktop vs mobile)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(LG_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsLgUp(e.matches);
    mql.addEventListener?.('change', handler) ?? mql.addListener(handler);
    return () =>
      mql.removeEventListener?.('change', handler) ??
      mql.removeListener(handler);
  }, []);

  // Fetch jobs whenever view changes
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data =
          view === 'saved' ? await getMySaved() : await getMyApplied();

        // Transform job types according to business rules
        const transformedData = data.map((job) => ({
          ...job,
          type: transformJobType(job.type),
        }));

        setJobs(transformedData);
      } catch (e: any) {
        console.error(`Error fetching ${view} jobs:`, e);
        if (e.name !== 'AbortError') {
          if (e.status === 401 || e.status === 403) {
            setError('Session expired. Please log in again.');
            // Redirect to login after a short delay
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else {
            setError(e?.message || 'Failed to fetch jobs');
          }
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [view]);

  // Auto-select the first job on desktop
  useEffect(() => {
    if (isLgUp && !selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId, isLgUp]);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const handleSelect = useCallback((id: number) => setSelectedJobId(id), []);
  const handleCloseMobile = useCallback(() => setSelectedJobId(null), []);

  // Delete one job (optimistic UI with rollback on error)
  const handleDelete = useCallback(
    async (id: number) => {
      const label = view === 'saved' ? 'saved' : 'applied';
      if (!window.confirm(`Delete this ${label} job?`)) return;

      // Store job info before removal for success message
      const jobToDelete = jobs.find((j) => j.id === id);
      const jobTitle = jobToDelete?.title || 'Job';

      const prev = jobs;
      setJobs(prev.filter((j) => j.id !== id));
      if (selectedJobId === id) setSelectedJobId(null);

      try {
        if (view === 'saved') await deleteSavedJob(id);
        else await deleteAppliedJob(id);

        // Show success message
        setSuccessMessage(
          `"${jobTitle}" has been deleted from your ${label} jobs.`
        );
        setShowSuccessAlert(true);

        // Auto-hide the alert after 5 seconds
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);

        const updatedJobs =
          view === 'saved' ? await getMySaved() : await getMyApplied();

        // Check if the job was actually deleted
        const jobStillExists = updatedJobs.some((job) => job.id === id);
        if (jobStillExists) {
          console.error(`Job with ID ${id} still exists after deletion!`);
          setError(
            `Failed to permanently delete the job. It may reappear on refresh.`
          );
        } else {
          console.log(`Job with ID ${id} successfully deleted and verified.`);
        }
      } catch (e: any) {
        console.error(`Error deleting ${label} job:`, e);
        setJobs(prev); // rollback
        if (e.status === 401 || e.status === 403) {
          setError('Session expired. Please log in again.');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (e.status === 419) {
          // CSRF token mismatch
          setError(
            'Security token expired. Please refresh the page and try again.'
          );
        } else {
          setError(e?.message || `Failed to delete ${label} job`);
        }
      }
    },
    [jobs, selectedJobId, view]
  );

  // Bulk delete Saved jobs
  const handleBulkDeleteSaved = useCallback(async () => {
    try {
      const count = jobs.length;
      await deleteAllSaved();
      setJobs([]);
      setSelectedJobId(null);

      // Show success message
      setSuccessMessage(`Successfully deleted all ${count} saved jobs.`);
      setShowSuccessAlert(true);

      // Auto-hide the alert after 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    } catch (e: any) {
      console.error('Error deleting all saved jobs:', e);
      if (e.status === 401 || e.status === 403) {
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (e.status === 419) {
        // CSRF token mismatch
        setError(
          'Security token expired. Please refresh the page and try again.'
        );
      } else {
        setError(e?.message || 'Failed to delete all saved jobs');
      }
    }
  }, [jobs.length]);

  // Bulk delete Applied jobs
  const handleBulkDeleteApplied = useCallback(async () => {
    try {
      const count = jobs.length;
      await deleteAllApplied();
      setJobs([]);
      setSelectedJobId(null);

      // Show success message
      setSuccessMessage(`Successfully deleted all ${count} applied jobs.`);
      setShowSuccessAlert(true);

      // Auto-hide the alert after 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    } catch (e: any) {
      console.error('Error deleting all applied jobs:', e);
      if (e.status === 401 || e.status === 403) {
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (e.status === 419) {
        // CSRF token mismatch
        setError(
          'Security token expired. Please refresh the page and try again.'
        );
      } else {
        setError(e?.message || 'Failed to delete all applied jobs');
      }
    }
  }, [jobs.length]);

  return (
    <div className="container-fluid w-100 d-flex flex-column flex-grow-1 min-h-0 pb-5">
      {/* Success alert notification */}
      {showSuccessAlert && (
        <div
          className="alert alert-success alert-dismissible fade show mb-3 shadow-sm border-start border-success border-4"
          role="alert"
          style={{
            animation: 'fadeIn 0.5s ease-out',
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '500px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-2 fs-4"></i>
            <div>
              <strong>Success!</strong>
              <div>{successMessage}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setShowSuccessAlert(false)}
          ></button>
        </div>
      )}

      <div className="d-flex w-100 flex-column flex-lg-row flex-grow-1 min-h-0">
        {/* Left: job list */}
        <div
          className="jobs-list flex-shrink-0 overflow-auto p-0"
          style={{
            flexBasis: '100%',
            flex: '0 0 30%',
            minHeight: 0,
            background: 'var(--surface-bg)',
            borderRight: '1px solid var(--surface-border-color)',
          }}
        >
          <div
            className="position-sticky top-0 p-3 border-bottom"
            style={{
              background: 'var(--surface-bg)',
              borderBottom: '1px solid var(--surface-border-color)',
            }}
          >
            {/* Header w/ Delete All for Saved & Applied */}
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="m-0 fw-700">
                {view === 'saved' ? 'Saved Jobs' : 'Applied Jobs'}
              </h4>
            </div>

            {/* Small toggle buttons under the title, above the list */}
            <div className="mt-2 d-flex justify-content-between align-items-center">
              <div className="btn-group btn-group-sm">
                {view === 'saved' ? (
                  <DeleteAll
                    label="Delete All"
                    disabled={loading || jobs.length === 0}
                    onConfirm={handleBulkDeleteSaved}
                  />
                ) : (
                  <DeleteAll
                    label="Delete All"
                    disabled={loading || jobs.length === 0}
                    onConfirm={handleBulkDeleteApplied}
                  />
                )}
              </div>

              <div
                className="btn-group btn-group-sm"
                role="group"
                aria-label="Choose jobs view"
              >
                <button
                  type="button"
                  className={`btn ${
                    view === 'saved' ? 'btn-info' : 'btn-outline-info'
                  }`}
                  onClick={() => onChangeView?.('saved')}
                >
                  Saved Jobs
                </button>
                <button
                  type="button"
                  className={`btn ${
                    view === 'applied' ? 'btn-success' : 'btn-outline-success'
                  }`}
                  onClick={() => onChangeView?.('applied')}
                >
                  Applied Jobs
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center m-3">
              <span>{error}</span>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-muted p-3">Loading jobs...</p>
          ) : (
            <div
              className="list-group list-group-flush"
              role="listbox"
              aria-label="My jobs list"
            >
              {jobs.map((job) => {
                const id = job.id;
                const isActive = selectedJobId === id;
                return (
                  <div
                    key={id}
                    className={`list-group-item w-100 text-start ${
                      isActive ? 'active' : ''
                    }`}
                    aria-selected={isActive}
                    style={{
                      background: 'var(--surface-bg)',
                      borderBottom: '1px solid var(--surface-border-color)',
                    }}
                  >
                    <div className="position-relative">
                      {/* Job preview (selects details on click) */}
                      <button
                        type="button"
                        onClick={() => handleSelect(id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            handleSelect(id);
                        }}
                        className="btn btn-link text-start p-0 text-decoration-none w-100"
                        aria-label="Open job details"
                      >
                        <SavedAppliedJobCard job={job} view={view} />
                      </button>
                      {/* Delete button (stops row select) */}
                      <div
                        className="position-absolute top-0 end-0 me-2 mt-2"
                        style={{ zIndex: 1 }}
                      >
                        <DeleteButton
                          onClick={(e?: any) => {
                            e?.stopPropagation?.();
                            handleDelete(id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {!jobs.length && !error && (
                <p className="text-muted m-3">No {view} jobs found.</p>
              )}
            </div>
          )}
        </div>

        {/* Right: job details (desktop only) */}
        <div
          className="job-details d-none d-lg-block flex-grow-1 overflow-auto p-3"
          style={{
            flexBasis: '100%',
            flex: '1 1 70%',
            minHeight: 0,
            background: 'var(--surface-bg)',
            borderLeft: '1px solid var(--surface-border-color)',
          }}
        >
          {selectedJob ? (
            <div className="mx-auto" style={{ maxWidth: 980 }}>
              <SavedAppliedJobCard
                job={selectedJob}
                detailed
                view={view}
                onAppliedRemove={(jobId) => {
                  // Remove the applied job from the displayed list
                  setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
                  setSelectedJobId(null);
                }}
              />
            </div>
          ) : loading ? (
            <p className="text-muted">Loading details…</p>
          ) : (
            <p className="text-muted">
              Select a job from the list to view details.
            </p>
          )}
        </div>
      </div>

      {/* Mobile: job details overlay */}
      {selectedJob && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
          aria-label="Job details"
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCloseMobile();
          }}
        >
          <div className="d-flex align-items-center justify-content-center h-100 p-3">
            <div
              className="shadow rounded w-100"
              style={{
                maxWidth: 640,
                maxHeight: '90vh',
                overflow: 'auto',
                background: 'var(--surface-bg)',
                border: '1px solid var(--surface-border-color)',
              }}
            >
              <div
                className="d-flex align-items-center justify-content-between p-2 border-bottom sticky-top"
                style={{
                  background: 'var(--surface-bg)',
                  borderBottom: '1px solid var(--surface-border-color)',
                }}
              >
                <strong>Job Details</strong>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseMobile}
                />
              </div>
              <div className="p-3">
                <SavedAppliedJobCard
                  job={selectedJob}
                  detailed
                  view={view}
                  onAppliedRemove={(jobId) => {
                    // Remove the applied job from the displayed list
                    setJobs((prevJobs) =>
                      prevJobs.filter((j) => j.id !== jobId)
                    );
                    setSelectedJobId(null);
                  }}
                />
                <div className="d-grid mt-3">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCloseMobile}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobsViewList;
