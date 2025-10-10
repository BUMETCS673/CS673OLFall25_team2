// Type.tdd.test.tsx
// Verifies open/close behavior, dynamic type population, selection logic, and event dispatching.
// 80% AI-generated, 20% human refined

import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Type from '../components/asideAndToggler/Type.tsx';

describe('Type component', () => {
  beforeEach(() => {
    // Clear listeners and any custom events between tests
    jest.restoreAllMocks();
  });

  it('renders button with default label', () => {
    render(<Type />);
    expect(screen.getByRole('button', { name: /type/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /type/i })).toHaveTextContent('Type');
  });

  it('opens and closes dropdown panel when clicked', async () => {
    render(<Type />);
    const button = screen.getByRole('button', { name: /type/i });

    await userEvent.click(button);
    expect(await screen.findByRole('dialog', { name: /type filter/i })).toBeInTheDocument();

    // Close via X button
    await userEvent.click(screen.getByLabelText(/close/i));
    expect(screen.queryByRole('dialog', { name: /type filter/i })).not.toBeInTheDocument();
  });

  it('closes when clicking outside', async () => {
    render(<Type />);
    const button = screen.getByRole('button', { name: /type/i });

    await userEvent.click(button);
    const panel = await screen.findByRole('dialog', { name: /type filter/i });
    expect(panel).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(document.body); // simulate click outside
    });
    expect(screen.queryByRole('dialog', { name: /type filter/i })).not.toBeInTheDocument();
  });

  it('renders dynamic types from jobs:types event', async () => {
    render(<Type />);
    const button = screen.getByRole('button', { name: /type/i });

    // Dispatch event before open — should sync value and list
    act(() => {
      const evt = new CustomEvent('jobs:types', {
        detail: { types: ['Full-time', 'Internship'], selectedType: null },
      });
      window.dispatchEvent(evt);
    });

    await userEvent.click(button);
    expect(await screen.findByRole('dialog', { name: /type filter/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /full-time/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /internship/i })).toBeInTheDocument();
  });

  it('calls onChange and dispatches jobs:typeSelect event when choosing a type', async () => {
    const mockOnChange = jest.fn();
    const spyDispatch = jest.spyOn(window, 'dispatchEvent');

    render(<Type onChange={mockOnChange} />);
    const button = screen.getByRole('button', { name: /type/i });

    act(() => {
      const evt = new CustomEvent('jobs:types', {
        detail: { types: ['Contract', 'Remote'], selectedType: null },
      });
      window.dispatchEvent(evt);
    });

    await userEvent.click(button);
    const option = await screen.findByRole('option', { name: /contract/i });
    await userEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith('Contract');
    expect(spyDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'jobs:typeSelect',
        detail: expect.objectContaining({ value: 'Contract' }),
      })
    );

    // After choosing, panel should close
    expect(screen.queryByRole('dialog', { name: /type filter/i })).not.toBeInTheDocument();
  });

  it('choosing "Any type" calls onChange with null', async () => {
    const mockOnChange = jest.fn();
    render(<Type onChange={mockOnChange} />);

    await userEvent.click(screen.getByRole('button', { name: /type/i }));
    const anyOption = await screen.findByRole('option', { name: /any type/i });
    await userEvent.click(anyOption);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('shows "No types detected yet…" when there are no types', async () => {
    render(<Type />);
    await userEvent.click(screen.getByRole('button', { name: /type/i }));

    expect(await screen.findByText(/no types detected yet/i)).toBeInTheDocument();
  });
});
