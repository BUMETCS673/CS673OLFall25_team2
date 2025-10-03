// ApplyJobButton.tsx
// Component for applying to jobs with localStorage persistence

import React from 'react';
import { applyJob } from '../../api/savedAndApplied/savedAndApplied';
import type { Job } from '../../types/job';
import { isJobApplied, toggleAppliedJobId } from './localStorageHelpers';

interface ApplyJobButtonProps {
  job: Job;
  detailed: boolean;
}

export default function ApplyJobButton({ job, detailed }: ApplyJobButtonProps) {
  const [state, setState] = React.useState<
    'idle' | 'applying' | 'applied' | 'error' | 'unapplying'
  >('idle');
  const [errMsg, setErrMsg] = React.useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);

  // Add CSS for fadeIn animation
  React.useEffect(() => {
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

  // Check localStorage on component mount
  React.useEffect(() => {
    if (job._id) {
      const applied = isJobApplied(job._id);
      if (applied) {
        setState('applied');
      } else {
        setState('idle');
      }
    }
  }, [job._id]);

  const onClick = async () => {
    if (!detailed) return;
    try {
      setErrMsg(null);

      // If already applied, toggle to unapply
      if (state === 'applied') {
        setState('unapplying');
        if (job._id) {
          const isApplied = toggleAppliedJobId(job._id);
          setState(isApplied ? 'applied' : 'idle');
        }
        return;
      }

      // Regular apply flow
      setState('applying');
      const token =
        (() => {
          try {
            return localStorage.getItem('jwt');
          } catch {
            return null;
          }
        })() || undefined;
      const res = await applyJob(job, token);
      const ok = !!(
        (res && res.success === true) ||
        (res &&
          typeof res === 'object' &&
          (res as any).result &&
          (res as any).result.success === true)
      );
      if (ok) {
        // Keep the button green as "Applied" (do not auto-reset to idle)
        setState('applied');

        // Save to localStorage
        if (job._id) {
          toggleAppliedJobId(job._id); // This will add it since we're in the apply flow
        }

        // Open the job URL in a new tab if it exists
        if (job.url) {
          window.open(job.url, '_blank', 'noopener,noreferrer');
        }

        // Show success alert
        setShowSuccessAlert(true);
      } else {
        throw new Error('Apply did not succeed');
      }
    } catch (e: any) {
      setErrMsg(e?.message || 'Failed to apply to job');
      setState('error');
    }
  };

  return (
    <>
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
              <strong>Job Successfully Applied!</strong>
              <div>"{job.title}" has been added to your Applied Jobs list.</div>
              {job.url && (
                <div className="mt-1">
                  Application page has been opened in a new tab.
                </div>
              )}
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

      <button
        type="button"
        className={`btn btn-${
          state === 'applied'
            ? 'success'
            : state === 'error'
            ? 'danger'
            : 'primary'
        } px-5`}
        disabled={state === 'applying' || state === 'unapplying' || !detailed}
        onClick={onClick}
        title={
          !detailed
            ? 'Open the detailed view to apply to this job'
            : state === 'applied'
            ? 'Click to unapply from this job'
            : 'Apply to this job'
        }
      >
        {state === 'applying'
          ? 'Applying…'
          : state === 'unapplying'
          ? 'Unapplying...'
          : state === 'applied'
          ? 'Applied'
          : 'Apply'}
      </button>
      {state === 'error' && errMsg && (
        <span className="text-danger small ms-2">{errMsg}</span>
      )}
    </>
  );
}
