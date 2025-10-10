// src/tests/SavedJobApplyButton.tdd.test.tsx
// Purpose: Verify SavedJobApplyButton’s UI states, application flow, and API interactions
// 80% AI-generated, 20% human refined

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SavedJobApplyButton from '../components/jobsList/SavedJobApplyButton';
import { applyJob } from '../api/savedAndApplied/savedAndApplied';
import { deleteSavedJob } from '../api/pages/myJobs';
import type { SavedAppliedJob } from '../api/pages/myJobs';

jest.mock('../api/savedAndApplied/savedAndApplied', () => ({
  applyJob: jest.fn(),
}));

jest.mock('../api/pages/myJobs', () => ({
  deleteSavedJob: jest.fn(),
}));

describe('SavedJobApplyButton', () => {
  const mockJob: SavedAppliedJob = {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Co',
    description: 'Build awesome UI',
    department: 'Engineering',
    url: 'http://example.com/job/frontend',
    location: '123 Tech St',
    locationAddress: '123 Tech St',
    locationCoordinates: { lat: 0, lon: 0 },
    salaryMin: 90000,
    salaryMax: 120000,
    employmentType: 'Full-time',
    requirements: 'React,TypeScript',
    type: 'Software',
    seniority: 'Mid-level',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    benefits: 'Gym,Insurance',
    // 修正类型
    postedBy: 123,
    applicationDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后 timestamp
  };

  beforeAll(() => {
    // mock window.open，避免 jsdom 报错
    window.open = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Apply Now button initially', () => {
    render(<SavedJobApplyButton job={mockJob} detailed={true} />);
    expect(screen.getByRole('button', { name: /Apply Now/i })).toBeInTheDocument();
  });

  it('disables button if detailed is false', () => {
    render(<SavedJobApplyButton job={mockJob} detailed={false} />);
    const btn = screen.getByRole('button', { name: /Apply Now/i });
    expect(btn).toBeDisabled();
  });

  it('calls applyJob and deleteSavedJob on successful apply', async () => {
    (applyJob as jest.Mock).mockResolvedValue({ success: true });
    (deleteSavedJob as jest.Mock).mockResolvedValue({ success: true });
    const onAppliedMock = jest.fn();

    render(
      <SavedJobApplyButton job={mockJob} detailed={true} onApplied={onAppliedMock} />
    );
    const btn = screen.getByRole('button', { name: /Apply Now/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(applyJob).toHaveBeenCalled();
      expect(deleteSavedJob).toHaveBeenCalledWith(mockJob.id);
      expect(onAppliedMock).toHaveBeenCalledWith(mockJob.id);
      expect(screen.getByText(/Applied Successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error message when applyJob fails', async () => {
    (applyJob as jest.Mock).mockRejectedValue(new Error('Network fail'));
    render(<SavedJobApplyButton job={mockJob} detailed={true} />);
    const btn = screen.getByRole('button', { name: /Apply Now/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(applyJob).toHaveBeenCalled();
      expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
      expect(screen.getByText(/Network fail/i)).toBeInTheDocument();
    });
  });

  it('opens new tab when job has URL', async () => {
    (applyJob as jest.Mock).mockResolvedValue({ success: true });

    render(<SavedJobApplyButton job={mockJob} detailed={true} />);
    const btn = screen.getByRole('button', { name: /Apply Now/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        mockJob.url,
        '_blank',
        'noopener,noreferrer'
      );
    });
  });
});