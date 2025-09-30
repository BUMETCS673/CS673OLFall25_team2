// SaveJobButton.tsx
// Component for saving jobs with localStorage persistence

import React from 'react';
import { saveJob } from '../../api/savedAndApplied/savedAndApplied';
import type { Job } from '../../types/job';
import { isJobSaved, toggleSavedJobId } from './localStorageHelpers';

interface SaveJobButtonProps {
  job: Job;
  detailed: boolean;
}

export default function SaveJobButton({ job, detailed }: SaveJobButtonProps) {
  const [state, setState] = React.useState<
    'idle' | 'saving' | 'saved' | 'error' | 'unsaving'
  >('idle');
  const [errMsg, setErrMsg] = React.useState<string | null>(null);

  // Check localStorage on component mount
  React.useEffect(() => {
    if (job._id) {
      const saved = isJobSaved(job._id);
      if (saved) {
        setState('saved');
      } else {
        setState('idle');
      }
    }
  }, [job._id]);

  const onClick = async () => {
    if (!detailed) return;
    try {
      setErrMsg(null);

      // If already saved, toggle to unsave
      if (state === 'saved') {
        setState('unsaving');
        if (job._id) {
          const isSaved = toggleSavedJobId(job._id);
          setState(isSaved ? 'saved' : 'idle');
        }
        return;
      }

      // Regular save flow
      setState('saving');
      const token =
        (() => {
          try {
            return localStorage.getItem('jwt');
          } catch {
            return null;
          }
        })() || undefined;
      const res = await saveJob(job, token);
      const ok = !!(
        (res && res.success === true) ||
        (res &&
          typeof res === 'object' &&
          (res as any).result &&
          (res as any).result.success === true)
      );
      if (ok) {
        // Keep the button green as "Saved" (do not auto-reset to idle)
        setState('saved');

        // Save to localStorage
        if (job._id) {
          toggleSavedJobId(job._id); // This will add it since we're in the save flow
        }
      } else {
        throw new Error('Save did not succeed');
      }
    } catch (e: any) {
      setErrMsg(e?.message || 'Failed to save job');
      setState('error');
    }
  };

  return (
    <>
      <button
        type="button"
        className={`btn ${
          state === 'saved'
            ? 'btn-success'
            : state === 'error'
            ? 'btn-danger'
            : 'btn-secondary'
        }`}
        disabled={state === 'saving' || state === 'unsaving' || !detailed}
        onClick={onClick}
        title={
          !detailed
            ? 'Open the detailed view to save this job'
            : state === 'saved'
            ? 'Click to unsave this job'
            : 'Save this job'
        }
      >
        {state === 'saving'
          ? 'Saving…'
          : state === 'unsaving'
          ? 'Unsaving...'
          : state === 'saved'
          ? 'Saved'
          : 'Save Job'}
      </button>
      {state === 'error' && errMsg && (
        <span className="text-danger small ms-2">{errMsg}</span>
      )}
    </>
  );
}
