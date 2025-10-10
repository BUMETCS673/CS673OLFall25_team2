import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyJobsButton from '../components/buttons/MyJobsButton';

/*
AI-generated code: 70% (tool: ChatGPT, adapted; test structure suggestion)
Human code(James): 25% (assertions for styling and rendering)
Framework-generated code: 5% (React Testing Library, Jest DOM APIs)
*/

describe('MyJobsButton', () => {
  test('renders with correct default styling class', () => {
    render(<MyJobsButton />);
    const btn = screen.getByRole('button', { name: /my jobs/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('my-jobs-button');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<MyJobsButton onClick={handleClick} />);
    const btn = screen.getByRole('button', { name: /my jobs/i });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies additional CSS classes from className prop', () => {
    render(<MyJobsButton className="test-class another-class" />);
    const btn = screen.getByRole('button', { name: /my jobs/i });
    expect(btn).toHaveClass('my-jobs-button');
    expect(btn).toHaveClass('test-class');
    expect(btn).toHaveClass('another-class');
  });

  test('uses custom aria-label when provided', () => {
    render(<MyJobsButton ariaLabel="Custom accessibility label" />);
    const btn = screen.getByRole('button', {
      name: /custom accessibility label/i,
    });
    expect(btn).toBeInTheDocument();
  });
});
