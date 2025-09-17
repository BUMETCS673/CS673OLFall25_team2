// src/types/job.ts

export type Coordinates = {
  lat: number;
  lon: number;
};

export type OwnerBenefits = {
  benefits: string[];
  title: string;
};

export type JobOwner = {
  benefits: OwnerBenefits;
  companyName: string;
  evaluatedSize: number | null;
  funding: string;
  isClaimed: boolean;
  locationAddress: string;
  photo: string; // e.g. "https://.../photo.png"
  rating: string; // e.g. "3.1"
  slug: string;
  teamSize: number;
  _id: string;
};

export type DescriptionBreakdown = {
  employmentType: string;
  keywords: string[];
  oneSentenceJobSummary: string;
  salaryRangeMaxYearly: number;
  salaryRangeMinYearly: number;
  skillRequirements: string[];
  workModel: string;
};

export type Job = {
  createdAt: string;
  department: string;
  descriptionBreakdown: DescriptionBreakdown;
  locationAddress: string;
  locationCoordinates: Coordinates;
  owner: JobOwner;
  seniority: string;
  skills_suggest: string[];
  title: string;
  type: string;
  updatedAt: string;
  url: string;
  _id: string;
};

// Optional: API envelope if you use it in fetch parsing
export type JobsApiEnvelope = {
  success: boolean;
  legal?: string;
  result?: {
    jobs: Job[];
  };
};
