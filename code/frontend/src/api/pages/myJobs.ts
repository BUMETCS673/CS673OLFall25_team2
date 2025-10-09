// src/api/pages/myJobs.ts
// API helpers for My Jobs (Saved/Applied) pages

import { postJson, stripEnvelope, getAuthToken } from '../http';

// Saved/Applied job shape returned by backend lists
export type SavedAppliedJob = {
  id: number;
  postedBy: number;
  title: string;
  description: string;
  company: string;
  location: string;
  employmentType?:
    | 'FULL_TIME'
    | 'PART_TIME'
    | 'CONTRACT'
    | 'INTERNSHIP'
    | 'REMOTE'
    | string;
  salaryMin: number;
  salaryMax: number;
  requirements: string;
  benefits: string;
  applicationDeadline: number;
  url: string;
  type: string;
  department: string;
  seniority: string;
  locationAddress: string;
  locationCoordinates?: { lon: number; lat: number } | null;
  createdAt?: number | string | null;
  updatedAt?: number | string | null;
  isActive?: boolean;
};

// Shape guard/normalizer: backend may wrap payloads differently
function normalizeJobs(payload: any): SavedAppliedJob[] {
  const unwrapped = stripEnvelope<any>(payload);
  if (!unwrapped) return [];
  // Common shapes we might receive
  if (Array.isArray(unwrapped)) return unwrapped as SavedAppliedJob[];
  if (Array.isArray(unwrapped?.jobs))
    return unwrapped.jobs as SavedAppliedJob[];
  if (Array.isArray(unwrapped?.result?.jobs))
    return unwrapped.result.jobs as SavedAppliedJob[];
  return [];
}

export async function getMySaved(): Promise<SavedAppliedJob[]> {
  const body = { size: 10, page: 0 };
  const { data } = await postJson<any>('/jobs/saved/list', body);

  console.log('getMySaved response data:', data);
  return normalizeJobs(data);
}

export async function getMyApplied(): Promise<SavedAppliedJob[]> {
  const body = { size: 10, page: 0 };
  const { data } = await postJson<any>('/jobs/applied/list', body);

  console.log('getMyApplied response data:', data);
  return normalizeJobs(data);
}

// Helper function to extract user ID from JWT token
function extractUserIdFromToken(token: string | null): number | undefined {
  if (!token) return undefined;

  try {
    // Simple JWT parsing (tokens have three parts separated by dots)
    const parts = token.split('.');
    if (parts.length === 3) {
      // Decode the payload part (second part)
      const payload = JSON.parse(atob(parts[1]));
      return payload.uid || payload.sub || payload.id;
    }
  } catch (e) {
    console.error('Error extracting user ID from token:', e);
  }
  return undefined;
}

// Delete a single saved job by id
export async function deleteSavedJob(id: string | number): Promise<void> {
  const jobId = Number(id); // Ensure it's a number
  // Get the user ID from the JWT token
  const uid = extractUserIdFromToken(getAuthToken());

  // Use the specified endpoint /jobs/saved/delete with the correct request body format
  const { data, response } = await postJson('/jobs/saved/delete', {
    jobIds: [jobId],
    uid: uid, // Include the user ID which is required by the backend
  });

  console.log('deleteSavedJob response:', response?.status, data);

  // Check if the deletion was successful
  const success =
    data?.success ||
    (data?.result && data.result.success) ||
    response?.status === 200;

  if (!success) {
    throw new Error('Failed to delete saved job');
  }
}

// Delete a single applied job by id
export async function deleteAppliedJob(id: string | number): Promise<void> {
  const jobId = Number(id); // Ensure it's a number
  // Get the user ID from the JWT token
  const uid = extractUserIdFromToken(getAuthToken());

  // Prepare the request body in the exact format expected by the backend
  const requestBody = {
    jobIds: [jobId],
    uid: uid, // Include the user ID which is required by the backend
  };
  console.log('deleteAppliedJob request body:', requestBody);

  try {
    // Use the specified endpoint /jobs/applied/delete with the correct request body format
    const { data, response } = await postJson(
      '/jobs/applied/delete',
      requestBody
    );

    console.log('deleteAppliedJob response:', response?.status, data);

    // Check if the deletion was successful
    const success =
      data?.success ||
      (data?.result && data.result.success) ||
      response?.status === 200;

    if (!success) {
      console.error('Applied job deletion failed with response:', data);
      throw new Error('Failed to delete applied job');
    } else {
      console.log('Successfully deleted applied job with ID:', jobId);
    }
  } catch (error) {
    console.error('Error deleting applied job:', error);
    throw error;
  }
}

// Bulk delete all saved jobs
export async function deleteAllSaved(): Promise<void> {
  // Get all saved jobs first to get their IDs
  const savedJobs = await getMySaved();
  if (!savedJobs.length) return; // No jobs to delete

  const jobIds = savedJobs.map((job) => job.id);
  // Get the user ID from the JWT token
  const uid = extractUserIdFromToken(getAuthToken());

  // Use the same endpoint as single deletion but with multiple IDs
  const { data, response } = await postJson('/jobs/saved/delete', {
    jobIds,
    uid, // Include the user ID which is required by the backend
  });

  console.log('deleteAllSaved response:', response?.status, data);

  // Check if the deletion was successful
  const success =
    data?.success ||
    (data?.result && data.result.success) ||
    response?.status === 200;

  if (!success) {
    throw new Error('Failed to delete all saved jobs');
  }
}

// Bulk delete all applied jobs
export async function deleteAllApplied(): Promise<void> {
  // Get all applied jobs first to get their IDs
  const appliedJobs = await getMyApplied();
  if (!appliedJobs.length) return; // No jobs to delete

  const jobIds = appliedJobs.map((job) => job.id);
  // Get the user ID from the JWT token
  const uid = extractUserIdFromToken(getAuthToken());

  // Use the same endpoint as single deletion but with multiple IDs
  const { data, response } = await postJson('/jobs/applied/delete', {
    jobIds,
    uid, // Include the user ID which is required by the backend
  });

  console.log('deleteAllApplied response:', response?.status, data);

  // Check if the deletion was successful
  const success =
    data?.success ||
    (data?.result && data.result.success) ||
    response?.status === 200;

  if (!success) {
    throw new Error('Failed to delete all applied jobs');
  }
}
