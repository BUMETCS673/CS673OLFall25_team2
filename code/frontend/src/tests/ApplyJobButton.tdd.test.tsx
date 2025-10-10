// src/tests/ApplyJobButton.tdd.test.tsx
// Purpose: Verify ApplyJobButton’s UI states, user interactions, and API/localStorage behavior
// 80% AI-generated, 20% human refined

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplyJobButton from '../components/jobsList/ApplyJobButton';
import { applyJob } from '../api/savedAndApplied/savedAndApplied';
import type { Job } from '../types/job';

// Mock the applyJob API
jest.mock('../api/savedAndApplied/savedAndApplied', () => ({
  applyJob: jest.fn(),
}));

// Mock localStorage helpers without importing (avoids TS unused import error)
jest.mock('../components/jobsList/localStorageHelpers', () => ({
  isJobApplied: jest.fn(() => false),
  toggleAppliedJobId: jest.fn(() => true),
}));

describe('ApplyJobButton', () => {
  // Mock window.open to avoid jsdom "Not implemented" error
  beforeAll(() => {
    window.open = jest.fn();
  });

  const mockJob: Job = {
    _id: '1',
    title: 'Frontend Developer',
    url: 'https://example.com/apply',
    createdAt: '',
    department: 'Engineering',
    descriptionBreakdown: {
      employmentType: 'Full-time',
      keywords: [],
      oneSentenceJobSummary: 'Develop front-end apps',
      salaryRangeMaxYearly: 120000,
      salaryRangeMinYearly: 80000,
      skillRequirements: ['React', 'TypeScript'],
      workModel: 'Remote',
    },
    locationAddress: '123 Main St',
    locationCoordinates: { lat: 0, lon: 0 },
    owner: {
      _id: 'o1',
      companyName: 'Tech Co',
      benefits: { title: 'Benefits', benefits: [] },
      evaluatedSize: null,
      funding: 'Series A',
      isClaimed: true,
      locationAddress: '123 Main St',
      photo: '',
      rating: '5',
      slug: 'tech-co',
      teamSize: 50,
    },
    seniority: 'Mid',
    skills_suggest: ['React', 'TypeScript'],
    type: 'Job',
    updatedAt: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Apply button initially', () => {
    render(<ApplyJobButton job={mockJob} detailed={true} />);
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });

  it('handles successful apply flow', async () => {
    (applyJob as jest.Mock).mockResolvedValue({ success: true });

    render(<ApplyJobButton job={mockJob} detailed={true} />);
    const btn = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(applyJob).toHaveBeenCalledWith(mockJob);
      expect(screen.getByRole('button', { name: /applied/i })).toBeInTheDocument();
      expect(screen.getByText(/successfully applied/i)).toBeInTheDocument();
    });
  });

  it('handles failed apply flow', async () => {
    (applyJob as jest.Mock).mockRejectedValue(new Error('Network fail'));

    render(<ApplyJobButton job={mockJob} detailed={true} />);
    const btn = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(applyJob).toHaveBeenCalled();
      expect(screen.getByText(/network fail/i)).toBeInTheDocument();
    });
  });
});
