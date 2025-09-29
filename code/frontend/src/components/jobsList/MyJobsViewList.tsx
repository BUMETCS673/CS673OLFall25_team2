import { useEffect, useMemo, useState, useCallback } from "react";
import JobCard from "./JobCard";
import type { Job } from "../../types/job";
import {
  getMySaved,
  getMyApplied,
  deleteSavedJob,
  deleteAppliedJob,
  deleteAllSaved,
  deleteAllApplied,
} from "../../api/endpoints/myJobs";
import DeleteButton from "../buttons/Delete";
import DeleteAll from "../buttons/DeleteAll";

/*
 AI-generated code: ~50% (tool: ChatGPT, adapted; chat link: https://chatgpt.com/share/68d6d0b7-3ca8-8006-a7b7-223d71795542)
 Human code: ~45% (bulk delete logic, error handling, data fetch integration)
 Framework-generated code: ~5% (Vite + React scaffolding conventions)
*/

const PANEL_MAX_HEIGHT = "100vh";
const LG_QUERY = "(min-width: 992px)";

interface MyJobsViewListProps {
  view: "saved" | "applied";
  onChangeView?: (v: "saved" | "applied") => void; // necessary prop
}

/**
 * Displays the Saved or Applied jobs list with two panels:
 * - Left: list of jobs with delete support
 * - Right: job details (desktop) or modal overlay (mobile)
 */
const MyJobsViewList: React.FC<MyJobsViewListProps> = ({ view, onChangeView }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLgUp, setIsLgUp] = useState<boolean>(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia(LG_QUERY).matches
        : true
  );

  // Watch for screen size changes (desktop vs mobile)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(LG_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsLgUp(e.matches);
    mql.addEventListener?.("change", handler) ?? mql.addListener(handler);
    return () =>
      mql.removeEventListener?.("change", handler) ?? mql.removeListener(handler);
  }, []);

  // Fetch jobs whenever view changes
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = view === "saved" ? await getMySaved() : await getMyApplied();
        setJobs(data as Job[]);
      } catch (e: any) {
        if (e.name !== "AbortError")
          setError(e?.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [view]);

  // Auto-select the first job on desktop
  useEffect(() => {
    if (isLgUp && !selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0]._id);
    }
  }, [jobs, selectedJobId, isLgUp]);

  const selectedJob = useMemo(
    () => jobs.find((j) => j._id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const handleSelect = useCallback((id: string) => setSelectedJobId(id), []);
  const handleCloseMobile = useCallback(() => setSelectedJobId(null), []);

  // Delete one job (optimistic UI with rollback on error)
  const handleDelete = useCallback(
    async (id: string) => {
      const label = view === "saved" ? "saved" : "applied";
      if (!window.confirm(`Delete this ${label} job?`)) return;

      const prev = jobs;
      setJobs(prev.filter((j) => j._id !== id));
      if (selectedJobId === id) setSelectedJobId(null);

      try {
        if (view === "saved") await deleteSavedJob(id);
        else await deleteAppliedJob(id);
      } catch (e: any) {
        setJobs(prev); // rollback
        setError(e?.message || `Failed to delete ${label} job`);
      }
    },
    [jobs, selectedJobId, view]
  );

  // Bulk delete Saved jobs
  const handleBulkDeleteSaved = useCallback(async () => {
    try {
      await deleteAllSaved();
      setJobs([]);
      setSelectedJobId(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete all saved jobs");
    }
  }, []);

  // Bulk delete Applied jobs
  const handleBulkDeleteApplied = useCallback(async () => {
    try {
      await deleteAllApplied();
      setJobs([]);
      setSelectedJobId(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete all applied jobs");
    }
  }, []);

  return (
    <div className="container-fluid w-100 d-flex flex-column flex-grow-1 min-h-0">
      <div className="d-flex w-100 flex-column flex-lg-row flex-grow-1 min-h-0">
        {/* Left: job list */}
        <div
          className="jobs-list flex-shrink-0 overflow-auto p-0"
          style={{
            flexBasis: "100%",
            flex: "0 0 30%",
            maxHeight: PANEL_MAX_HEIGHT,
            minHeight: 0,
            background: "var(--surface-bg)",
            borderRight: "1px solid var(--surface-border-color)",
          }}
        >
          <div
            className="position-sticky top-0 p-3 border-bottom"
            style={{
              background: "var(--surface-bg)",
              borderBottom: "1px solid var(--surface-border-color)",
            }}
          >
            {/* Header w/ Delete All for Saved & Applied */}
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="m-0">
                {view === "saved" ? "Saved Jobs" : "Applied Jobs"}
              </h2>

              {view === "saved" ? (
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

            {/* Small toggle buttons under the title, above the list */}
            <div className="mt-2">
              <div className="btn-group btn-group-sm" role="group" aria-label="Choose jobs view">
                <button
                  type="button"
                  className={`btn ${view === "saved" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => onChangeView?.("saved")}
                >
                  Saved Jobs
                </button>
                <button
                  type="button"
                  className={`btn ${view === "applied" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => onChangeView?.("applied")}
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
                const id = job._id;
                const isActive = selectedJobId === id;
                return (
                  <div
                    key={id}
                    className={`list-group-item w-100 text-start ${
                      isActive ? "active" : ""
                    }`}
                    aria-selected={isActive}
                    style={{
                      background: "var(--surface-bg)",
                      borderBottom: "1px solid var(--surface-border-color)",
                    }}
                  >
                    <div className="d-flex align-items-start">
                      {/* Job preview (selects details on click) */}
                      <button
                        type="button"
                        onClick={() => handleSelect(id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleSelect(id);
                        }}
                        className="btn btn-link text-start p-0 flex-grow-1 text-decoration-none"
                        aria-label="Open job details"
                      >
                        <JobCard job={job} />
                      </button>

                      {/* Delete button (stops row select) */}
                      <div className="ms-2 mt-1">
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
            flexBasis: "100%",
            flex: "1 1 70%",
            maxHeight: PANEL_MAX_HEIGHT,
            minHeight: 0,
            background: "var(--surface-bg)",
            borderLeft: "1px solid var(--surface-border-color)",
          }}
        >
          {selectedJob ? (
            <div className="mx-auto" style={{ maxWidth: 980 }}>
              <JobCard job={selectedJob} detailed />
            </div>
          ) : loading ? (
            <p className="text-muted">Loading details…</p>
          ) : (
            <p className="text-muted">Select a job from the list to view details.</p>
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
            if (e.key === "Escape") handleCloseMobile();
          }}
        >
          <div className="d-flex align-items-center justify-content-center h-100 p-3">
            <div
              className="shadow rounded w-100"
              style={{
                maxWidth: 640,
                maxHeight: "90vh",
                overflow: "auto",
                background: "var(--surface-bg)",
                border: "1px solid var(--surface-border-color)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-between p-2 border-bottom sticky-top"
                style={{
                  background: "var(--surface-bg)",
                  borderBottom: "1px solid var(--surface-border-color)",
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

export default MyJobsViewList;