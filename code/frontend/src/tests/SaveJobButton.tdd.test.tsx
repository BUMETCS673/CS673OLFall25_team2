// SaveJobButton.test.tsx
// Purpose: Verify SaveJobButton’s UI states and API/localStorage interactions
// 80% AI-generated, 20% human refined

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SaveJobButton from '../components/jobsList/SaveJobButton';
import { saveJob } from '../api/savedAndApplied/savedAndApplied';
import {
  isJobSaved,
  toggleSavedJobId,
} from '../components/jobsList/localStorageHelpers';

jest.mock('../api/savedAndApplied/savedAndApplied', () => ({
  saveJob: jest.fn(),
}));

jest.mock('../components/jobsList/localStorageHelpers', () => ({
  isJobSaved: jest.fn(),
  toggleSavedJobId: jest.fn(),
}));

describe('SaveJobButton', () => {
  const job = { _id: 'abc123', title: 'Frontend Engineer' } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Save Job initially when not saved', () => {
    (isJobSaved as jest.Mock).mockReturnValue(false);
    render(<SaveJobButton job={job} detailed={true} />);
    expect(screen.getByRole('button', { name: /save job/i })).toBeInTheDocument();
  });

  it('renders Saved when job is already saved', () => {
    (isJobSaved as jest.Mock).mockReturnValue(true);
    render(<SaveJobButton job={job} detailed={true} />);
    expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();
  });

  it('disables button when detailed=false', () => {
    (isJobSaved as jest.Mock).mockReturnValue(false);
    render(<SaveJobButton job={job} detailed={false} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('title', 'Open the detailed view to save this job');
  });

  it('handles successful save flow', async () => {
    (isJobSaved as jest.Mock).mockReturnValue(false);
    (saveJob as jest.Mock).mockResolvedValue({ success: true });
    (toggleSavedJobId as jest.Mock).mockReturnValue(true);

    render(<SaveJobButton job={job} detailed={true} />);

    const btn = screen.getByRole('button', { name: /save job/i });
    fireEvent.click(btn);

    // Should change to Saving…
    expect(await screen.findByText(/saving/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(saveJob).toHaveBeenCalledWith(job);
      expect(toggleSavedJobId).toHaveBeenCalledWith('abc123');
      expect(screen.getByText(/saved/i)).toBeInTheDocument();
    });
  });

  it('handles failed save flow gracefully', async () => {
    (isJobSaved as jest.Mock).mockReturnValue(false);
    (saveJob as jest.Mock).mockRejectedValue(new Error('Network fail'));

    render(<SaveJobButton job={job} detailed={true} />);

    const btn = screen.getByRole('button', { name: /save job/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(saveJob).toHaveBeenCalled();
      expect(screen.getByText(/network fail/i)).toBeInTheDocument();
    });
  });

  it('unsaves when already saved and clicked again', async () => {
    (isJobSaved as jest.Mock).mockReturnValue(true);
    (toggleSavedJobId as jest.Mock).mockReturnValue(false);

    render(<SaveJobButton job={job} detailed={true} />);
    const btn = screen.getByRole('button', { name: /saved/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(toggleSavedJobId).toHaveBeenCalledWith('abc123');
      expect(screen.getByRole('button', { name: /save job/i })).toBeInTheDocument();
    });
  });
});