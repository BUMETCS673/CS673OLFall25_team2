// src/api/savedAndApplied/saved.ts
// API helpers for saving jobs

import { postJson } from '../http';
import type { Job } from '../../types/job';

export type SaveJobResponse = {
  success?: boolean;
  message?: string;
  result?: any;
  [k: string]: any;
};

export type SavedJobPayload = {
  postedBy: number;
  title: string;
  description: string;
  company: string;
  location: string;
  // Match backend enum when present; omit if unknown
  employmentType?:
    | 'FULL_TIME'
    | 'PART_TIME'
    | 'CONTRACT'
    | 'INTERNSHIP'
    | 'REMOTE';
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
  locationCoordinates: { lon: number; lat: number };
};

export function buildSavedJobPayload(job: Job): SavedJobPayload {
  const db = job.descriptionBreakdown || ({} as any);

  const salaryMin = Number(db.salaryRangeMinYearly);
  const salaryMax = Number(db.salaryRangeMaxYearly);

  // Build deadline: one month ahead from today (calendar month)
  const deadline = new Date();
  deadline.setMonth(deadline.getMonth() + 1);
  const applicationDeadline = deadline.getTime();

  // Normalize employment type to backend enum names; return undefined if not recognized
  const normalizeEmploymentType = (
    val: any
  ): SavedJobPayload['employmentType'] => {
    // Lowercase and strip non-letters to handle cases like "Full-time", "Part time", "F/T", etc.
    const raw = String(val ?? '');
    const s = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, '');
    if (!s) return undefined;

    // Full-time variants: fulltime, ft, ftime
    if (s.includes('full') || s === 'ft' || s === 'ftime') return 'FULL_TIME';

    // Part-time variants: parttime, pt, ptime
    if (s.includes('part') || s === 'pt' || s === 'ptime') return 'PART_TIME';

    // Contract variants: contractor, contract, temp, temporary, freelance, consultant
    if (
      s.includes('contract') ||
      s.includes('temp') ||
      s.includes('freelance') ||
      s.includes('consult')
    )
      return 'CONTRACT';

    // Internship variants: intern, internship
    if (s.includes('intern')) return 'INTERNSHIP';

    // Remote variants: remote, remotely, wfh, workfromhome, anywhere, home
    if (
      s.includes('remote') ||
      s.includes('wfh') ||
      s.includes('workfromhome') ||
      s.includes('anywhere') ||
      s.includes('home')
    )
      return 'REMOTE';
    return undefined;
  };

  const requirementsStr = Array.isArray(db.skillRequirements)
    ? db.skillRequirements.filter(Boolean).join(', ')
    : '';
  const benefitsStr = Array.isArray(job.owner?.benefits?.benefits)
    ? job.owner.benefits.benefits.filter(Boolean).join(', ')
    : '';

  const employmentType =
    normalizeEmploymentType(db.employmentType) || 'FULL_TIME';

  // Build payload; only include employmentType when recognized to avoid enum parse errors
  return {
    postedBy: 1,
    title: job.title || 'Untitled',
    description:
      db.oneSentenceJobSummary || job.title || 'Job description not provided',
    company: job.owner?.companyName || 'Unknown Company',
    location: job.locationAddress || 'Unknown',
    employmentType,
    salaryMin: Number.isNaN(salaryMin) ? 0 : salaryMin,
    salaryMax: Number.isNaN(salaryMax) ? 0 : salaryMax,
    requirements: requirementsStr,
    benefits: benefitsStr.length > 0 ? benefitsStr : 'Health, 401k',
    applicationDeadline,
    url: job.url || 'https://www.example.com/apply',
    type: job.type || 'Hybrid',
    department: job.department || 'General',
    seniority: job.seniority || 'Entry Level',
    locationAddress: job.owner?.locationAddress || '1 Main St, Boston, MA',
    locationCoordinates: job.locationCoordinates || { lat: 0, lon: 0 },
  };
}

export async function saveJob(job: Job): Promise<SaveJobResponse> {
  const payload = buildSavedJobPayload(job);
  const { data } = await postJson<SaveJobResponse>('/jobs/saved/save', payload);
  console.log('Save job response data:', data);
  return data;
}

export async function applyJob(job: Job): Promise<SaveJobResponse> {
  const payload = buildSavedJobPayload(job);
  const { data } = await postJson<SaveJobResponse>(
    '/jobs/applied/apply',
    payload
  );
  console.log('Apply job response data:', data);
  return data;
}
