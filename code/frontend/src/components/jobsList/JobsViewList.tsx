// JobsViewList.tsx
// Copilot and ChatGPT assisted with this component
// 70% human written, 20% Copilot, 10% ChatGPT

import { useEffect, useMemo, useState, useCallback } from 'react';
import JobCard from './JobCard';
import type { Job, JobsApiEnvelope } from '../../types/job';
import './JobsViewList.css';

const LG_QUERY = '(min-width: 992px)';

const JobsViewList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLgUp, setIsLgUp] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(LG_QUERY).matches : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(LG_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsLgUp(e.matches);

    mql.addEventListener
      ? mql.addEventListener('change', handler)
      : mql.addListener(handler);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener('change', handler)
        : mql.removeListener(handler);
    };
  }, []);

  const jobTypes = useMemo(() => {
    const set = new Map<string, string>();
    for (const j of jobs) {
      if (j.type) {
        const norm = j.type.trim();
        if (norm && !set.has(norm.toLowerCase()))
          set.set(norm.toLowerCase(), norm);
      }
    }
    return Array.from(set.values()).sort();
  }, [jobs]);

  // Derive list of unique departments
  const jobDepartments = useMemo(() => {
    const set = new Map<string, string>();
    for (const j of jobs) {
      if (j.department) {
        const norm = j.department.trim();
        if (norm && !set.has(norm.toLowerCase()))
          set.set(norm.toLowerCase(), norm);
      }
    }
    return Array.from(set.values()).sort();
  }, [jobs]);

  // Filter jobs by selectedType AND selectedDepartment if provided
  const filteredJobs = useMemo(
    () =>
      jobs.filter((j) => {
        const typeOk =
          !selectedType ||
          (j.type &&
            j.type.trim().toLowerCase() === selectedType.trim().toLowerCase());
        const deptOk =
          !selectedDepartment ||
          (j.department &&
            j.department.trim().toLowerCase() ===
              selectedDepartment.trim().toLowerCase());
        return typeOk && deptOk;
      }),
    [jobs, selectedType, selectedDepartment]
  );

  const selectedJob = useMemo(
    () => filteredJobs.find((j) => j._id === selectedJobId) ?? null,
    [filteredJobs, selectedJobId]
  );

  // Pedro's written code
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

  // Pedro's written code
  useEffect(() => {
    if (isLgUp && !selectedJobId && filteredJobs.length > 0)
      setSelectedJobId(filteredJobs[0]._id);
  }, [filteredJobs, selectedJobId, isLgUp]);

  // Expose dynamic types & departments via custom events so filters can subscribe without prop drilling
  useEffect(() => {
    const typeEvent = new CustomEvent('jobs:types', {
      detail: { types: jobTypes, selectedType },
    });
    window.dispatchEvent(typeEvent);

    const deptEvent = new CustomEvent('jobs:departments', {
      detail: { departments: jobDepartments, selectedDepartment },
    });
    window.dispatchEvent(deptEvent);
  }, [jobTypes, selectedType, jobDepartments, selectedDepartment]);

  // Listen for type & department selection events from filter components
  useEffect(() => {
    const typeHandler = (e: Event) => {
      const ce = e as CustomEvent<{ value: string | null }>;
      setSelectedType(ce.detail.value);
      setSelectedJobId(null);
    };
    const deptHandler = (e: Event) => {
      const ce = e as CustomEvent<{ value: string | null }>;
      setSelectedDepartment(ce.detail.value);
      setSelectedJobId(null);
    };
    window.addEventListener('jobs:typeSelect', typeHandler);
    window.addEventListener('jobs:departmentSelect', deptHandler);
    return () => {
      window.removeEventListener('jobs:typeSelect', typeHandler);
      window.removeEventListener('jobs:departmentSelect', deptHandler);
    };
  }, []);

  // Pedro's written code
  const handleSelect = useCallback((id: string) => setSelectedJobId(id), []);
  const handleCloseMobile = useCallback(() => setSelectedJobId(null), []);

  return (
    <div className="container-fluid w-100 d-flex flex-column flex-grow-1 min-h-0 pb-5">
      <div className="d-flex w-100 flex-column flex-lg-row flex-grow-1 min-h-0">
        {/* Left: list (30% on lg+, full width on mobile) */}
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
            <h5 className="m-0 d-flex align-items-center gap-2">
              <span>Available Jobs</span>
              <span
                className="badge bg-info"
                aria-label={`Total jobs${
                  selectedType ? ' for selected type' : ''
                }`}
              >
                {filteredJobs.length}
              </span>
            </h5>
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
              {filteredJobs.map((job) => {
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
                    style={{
                      background: 'var(--surface-bg)',
                      borderBottom: '1px solid var(--surface-border-color)',
                    }}
                  >
                    <JobCard job={job} />
                  </button>
                );
              })}
              {!filteredJobs.length && !error && (
                <p className="text-muted m-3">
                  No jobs found
                  {selectedType ? ` for type "${selectedType}"` : ''}.
                </p>
              )}
            </div>
          )}
        </div>

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

      {selectedJob && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 job-modal"
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
