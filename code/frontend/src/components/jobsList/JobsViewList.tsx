// JobsViewList.tsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import JobCard from './JobCard';
import type { Job, JobsApiEnvelope } from '../../types/job';

const PANEL_MAX_HEIGHT = '75vh'; // adjust if you like
const LG_QUERY = '(min-width: 992px)'; // Bootstrap "lg"

const JobsViewList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Track if viewport is lg and up
  const [isLgUp, setIsLgUp] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(LG_QUERY).matches : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(LG_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsLgUp(e.matches);
    // Safari fallback
    mql.addEventListener
      ? mql.addEventListener('change', handler)
      : mql.addListener(handler);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener('change', handler)
        : mql.removeListener(handler);
    };
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((j) => j._id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.joinrise.io/api/v1/jobs/public?page=2&limit=150&sort=asc&sortedBy=createdAt&includeDescription=true&isTrending=true',
          { signal: controller.signal }
        );
        if (!response.ok)
          throw new Error(`Error fetching jobs: ${response.statusText}`);
        const data: JobsApiEnvelope = await response.json();
        const list: Job[] = data?.result?.jobs || [];
        setJobs(list);
        setError(null);
      } catch (e: any) {
        if (e.name !== 'AbortError')
          setError(e?.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  // Auto-select first job only on desktop (lg+). On mobile we wait for a tap.
  useEffect(() => {
    if (isLgUp && !selectedJobId && jobs.length > 0)
      setSelectedJobId(jobs[0]._id);
  }, [jobs, selectedJobId, isLgUp]);

  const handleSelect = useCallback((id: string) => setSelectedJobId(id), []);
  const handleCloseMobile = useCallback(() => setSelectedJobId(null), []);

  return (
    <div className="container-fluid w-100">
      <div
        className="d-flex w-100 gap-3 flex-column flex-lg-row"
        style={{ minHeight: 0 }}
      >
        {/* Left: list (30% on lg+, full width on mobile) */}
        <div
          className="jobs-list border-0 bg-body flex-shrink-0 overflow-auto p-0"
          style={{
            flexBasis: '100%', // full width when stacked
            flex: '0 0 30%', // ~30% on lg+ row layout
            maxHeight: PANEL_MAX_HEIGHT,
            minHeight: 0,
          }}
        >
          {/* Sticky header */}
          <div className="position-sticky top-0 bg-body p-3 border-bottom">
            <h2 className="m-0">Job Listings</h2>
          </div>

          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center m-3">
              <span>{error}</span>
              <button
                className="btn btn-sm btn-light"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-muted p-3">Loading jobs...</p>
          ) : (
            <div
              className="list-group list-group-flush"
              role="listbox"
              aria-label="Job list"
            >
              {jobs.map((job) => {
                const isActive = selectedJobId === job._id;
                return (
                  <button
                    key={job._id}
                    type="button"
                    onClick={() => handleSelect(job._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        handleSelect(job._id);
                    }}
                    className={`list-group-item list-group-item-action w-100 text-start ${
                      isActive ? 'active' : ''
                    }`}
                    aria-selected={isActive}
                  >
                    <JobCard job={job} />
                  </button>
                );
              })}
              {!jobs.length && !error && (
                <p className="text-muted m-3">No jobs found.</p>
              )}
            </div>
          )}
        </div>

        {/* Right: details (70% on lg+, hidden on mobile) */}
        <div
          className="job-details d-none d-lg-block border-0 p-3 bg-body flex-grow-1 overflow-auto"
          style={{
            flexBasis: '100%',
            flex: '1 1 70%',
            maxHeight: PANEL_MAX_HEIGHT,
            minHeight: 0,
          }}
        >
          {selectedJob ? (
            <div className="mx-auto" style={{ maxWidth: 980 }}>
              <JobCard job={selectedJob} detailed />
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

      {/* Mobile overlay: centered details with Close button */}
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
              className="bg-white shadow rounded w-100"
              style={{ maxWidth: 640, maxHeight: '90vh', overflow: 'auto' }}
            >
              <div className="d-flex align-items-center justify-content-between p-2 border-bottom sticky-top bg-white">
                <strong>Job Details</strong>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseMobile}
                />
              </div>
              <div className="p-3">
                <JobCard job={selectedJob} detailed />
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

export default JobsViewList;
