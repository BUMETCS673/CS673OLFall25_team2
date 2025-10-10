// SavedJobApplyButton.tsx
// Component for applying to saved jobs

import React from 'react';
import { applyJob } from '../../api/savedAndApplied/savedAndApplied';
import type { SavedAppliedJob } from '../../api/pages/myJobs';
import { deleteSavedJob } from '../../api/pages/myJobs';
import type { Job } from '../../types/job';

interface SavedJobApplyButtonProps {
  job: SavedAppliedJob;
  detailed: boolean;
  onApplied?: (jobId: number) => void; // Callback when job is successfully applied to
}

// Create a global alert container if it doesn't exist
function ensureAlertContainer(): HTMLElement {
  const containerId = 'global-alert-container';
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.top = '80px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '9999';
    container.style.width = 'auto';
    container.style.minWidth = '350px';
    container.style.maxWidth = '600px';
    document.body.appendChild(container);
  }

  return container;
}

export default function SavedJobApplyButton({
  job,
  detailed,
  onApplied,
}: SavedJobApplyButtonProps) {
  const [state, setState] = React.useState<
    'idle' | 'applying' | 'applied' | 'error'
  >('idle');
  const [errMsg, setErrMsg] = React.useState<string | null>(null);

  // Add CSS for fadeIn animation and set up global event listeners
  React.useEffect(() => {
    // Add CSS animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
        to { opacity: 1; transform: translateY(0) translateX(-50%); }
      }
      
      #global-alert-container .alert {
        margin-bottom: 10px;
      }
    `;
    document.head.appendChild(style);

    // Add document click handler to dismiss alerts when clicked outside
    const handleDocumentClick = (e: MouseEvent) => {
      const alertContainer = document.getElementById('global-alert-container');
      if (alertContainer && !alertContainer.contains(e.target as Node)) {
        // Remove all alerts when clicking outside
        alertContainer.innerHTML = '';
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.head.removeChild(style);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const onClick = async () => {
    if (!detailed) return;
    console.log('Apply button clicked');
    try {
      setErrMsg(null);
      setState('applying');

      // Open the job URL in a new tab if it exists
      if (job.url) {
        window.open(job.url, '_blank', 'noopener,noreferrer');
      }

      // Convert SavedAppliedJob to format expected by applyJob
      const jobData = {
        _id: String(job.id),
        title: job.title,
        description: job.description || '',
        company: job.company,
        location: job.location,
        descriptionBreakdown: {
          salaryRangeMinYearly: job.salaryMin,
          salaryRangeMaxYearly: job.salaryMax,
          employmentType: job.employmentType || '',
          workModel: 'hybrid',
          keywords: [],
          skillRequirements: job.requirements?.split(',') || [],
          oneSentenceJobSummary: job.description?.substring(0, 100) || '',
        },
        url: job.url,
        type: job.type || '',
        department: job.department || '',
        seniority: job.seniority || '',
        locationAddress: job.locationAddress || '',
        locationCoordinates: job.locationCoordinates || { lat: 0, lon: 0 },
        // Required by Job type
        createdAt: job.createdAt?.toString() || new Date().toISOString(),
        updatedAt: job.updatedAt?.toString() || new Date().toISOString(),
        skills_suggest: [],
        owner: {
          benefits: {
            benefits: job.benefits?.split(',') || [],
            title: 'Benefits',
          },
          companyName: job.company,
          evaluatedSize: null,
          funding: '',
          isClaimed: false,
          locationAddress: job.locationAddress || '',
          photo: '',
          rating: '',
          slug: '',
          teamSize: 0,
          _id: '1',
        },
      } as Job;

      // No need to manually pass token anymore - handled by http.ts
      const res = await applyJob(jobData);

      const ok = !!(
        (res && res.success === true) ||
        (res &&
          typeof res === 'object' &&
          (res as any).result &&
          (res as any).result.success === true)
      );

      if (ok) {
        // After successfully applying, delete this job from saved jobs list
        try {
          await deleteSavedJob(job.id);
          console.log(
            'Successfully removed job from saved jobs after applying'
          );
        } catch (deleteErr) {
          console.error(
            'Failed to remove job from saved jobs after applying',
            deleteErr
          );
          // Still mark as applied even if deletion fails
        }

        // Notify parent that this job was applied to (and should be removed from saved jobs list)
        if (onApplied) {
          onApplied(job.id);
        }

        setState('applied');

        // Create global alert
        const container = ensureAlertContainer();
        const alertDiv = document.createElement('div');
        alertDiv.className =
          'alert alert-success alert-dismissible fade show mb-3 shadow-sm border-start border-success border-4';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.style.animation = 'fadeIn 0.5s ease-out';
        alertDiv.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        alertDiv.innerHTML = `
          <div class="d-flex align-items-center">
            <i class="bi bi-check-circle-fill me-2 fs-4"></i>
            <div>
              <strong class="fs-5">Job Successfully Applied!</strong>
              <div class="mt-1">"${
                job.title
              }" has been moved to your Applied Jobs list.</div>
              ${
                job.url
                  ? '<div class="mt-1">The application page has been opened in a new tab.</div>'
                  : ''
              }
            </div>
          </div>
          <button type="button" class="btn-close" aria-label="Close"></button>
        `;

        // Add close button functionality
        const closeButton = alertDiv.querySelector('.btn-close');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            alertDiv.remove();
          });
        }

        // Add the alert to the container
        container.appendChild(alertDiv);
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
      <div className="d-flex flex-column">
        <button
          type="button"
          className={`btn ${
            state === 'applied'
              ? 'btn-success'
              : state === 'error'
              ? 'btn-outline-danger'
              : 'btn-info'
          } px-4`}
          disabled={state === 'applying' || state === 'applied' || !detailed}
          onClick={onClick}
          title={
            !detailed
              ? 'Open the detailed view to apply to this job'
              : state === 'applied'
              ? 'Successfully applied to this job'
              : `Apply to this job (opens ${
                  job.url ? 'application page' : 'job details'
                } in a new tab)`
          }
        >
          {state === 'applying' ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Applying...
            </>
          ) : state === 'applied' ? (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Applied Successfully
            </>
          ) : state === 'error' ? (
            <>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Try Again
            </>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>
              Apply Now{' '}
              <i
                className="bi bi-box-arrow-up-right ms-1"
                style={{ fontSize: '0.8em' }}
              ></i>
            </>
          )}
        </button>
        {state === 'error' && errMsg && (
          <div className="text-danger small mt-2">
            <i className="bi bi-exclamation-circle me-1"></i>
            {errMsg}
          </div>
        )}
      </div>
    </>
  );
}
