import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyJobsButton from '../components/buttons/MyJobsButton';

/*
AI-generated code: 70% (tool: ChatGPT, adapted; test structure suggestion)
Human code(James): 25% (assertions for styling and rendering)
Framework-generated code: 5% (React Testing Library, Jest DOM APIs)
*/

test('renders My Jobs button with correct styling class', () => {
  render(<MyJobsButton />);
  const btn = screen.getByRole('button', { name: /my jobs/i });
  expect(btn).toBeInTheDocument();
  expect(btn).toHaveClass('my-jobs-button');
});
