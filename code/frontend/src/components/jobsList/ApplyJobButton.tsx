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
