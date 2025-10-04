// localStorageHelpers.ts
// 100% Copilot generated helpers for managing saved and applied jobs in localStorage

// Keys used for localStorage
export const SAVED_JOBS_KEY = 'savedJobs';
export const APPLIED_JOBS_KEY = 'appliedJobs';

// For debugging, call this in the console to clear saved/applied jobs
export const clearSavedAppliedJobs = (): string => {
  localStorage.removeItem(SAVED_JOBS_KEY);
  localStorage.removeItem(APPLIED_JOBS_KEY);

  console.log('Cleared saved and applied jobs from localStorage');
  return 'Cleared';
};

// Register the debug function to window
if (typeof window !== 'undefined') {
  (window as any).clearSavedAppliedJobs = clearSavedAppliedJobs;
}

export const getSavedJobIds = (): string[] => {
  try {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const getAppliedJobIds = (): string[] => {
  try {
    const applied = localStorage.getItem(APPLIED_JOBS_KEY);
    return applied ? JSON.parse(applied) : [];
  } catch {
    return [];
  }
};

export const toggleSavedJobId = (jobId: string): boolean => {
  try {
    const savedJobs = getSavedJobIds();
    const index = savedJobs.indexOf(jobId);

    if (index === -1) {
      // Add the job ID if it doesn't exist
      savedJobs.push(jobId);
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
      return true; // Job is now saved
    } else {
      // Remove the job ID if it exists
      savedJobs.splice(index, 1);
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
      return false; // Job is now unsaved
    }
  } catch (error) {
    console.error('Failed to toggle saved job ID in localStorage', error);
    return false;
  }
};

export const toggleAppliedJobId = (jobId: string): boolean => {
  try {
    const appliedJobs = getAppliedJobIds();
    const index = appliedJobs.indexOf(jobId);

    if (index === -1) {
      // Add the job ID if it doesn't exist
      appliedJobs.push(jobId);
      localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(appliedJobs));
      return true; // Job is now applied
    } else {
      // Remove the job ID if it exists
      appliedJobs.splice(index, 1);
      localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(appliedJobs));
      return false; // Job is now unapplied
    }
  } catch (error) {
    console.error('Failed to toggle applied job ID in localStorage', error);
    return false;
  }
};

export const isJobSaved = (jobId: string): boolean => {
  const savedIds = getSavedJobIds();
  return savedIds.includes(jobId);
};

export const isJobApplied = (jobId: string): boolean => {
  const appliedIds = getAppliedJobIds();
  return appliedIds.includes(jobId);
};
