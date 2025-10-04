import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Aside from '../components/asideAndToggler/Aside';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext';

/*
AI-generated code: 70% (tool: ChatGPT, adapted; functions: jest.mock usage and test case scaffolding; AI chat links: [https://chatgpt.com/share/68e18e34-9110-8006-b694-a6dadf0cafd5])
Human code (James): 25% (test logic, expectations, and navigation assertions)
Framework-generated code: 5% (React Testing Library, Jest DOM APIs)
*/

// Mock navigate so we can assert where it goes
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});


test('shows "My Jobs" on non-MyJobs routes and navigates to /myJobs', () => {
  render(
    <MemoryRouter initialEntries={['/content']}>
      <ThemeProvider>
        <Aside />
      </ThemeProvider>
    </MemoryRouter>
  );
  const btn = screen.getByRole('button', { name: /my jobs/i });
  fireEvent.click(btn);
  expect(mockNavigate).toHaveBeenCalledWith('/myJobs');
});


test('shows "Home" on /myJobs and navigates to /content', () => {
  mockNavigate.mockClear();
  render(
    <MemoryRouter initialEntries={['/myJobs']}>
      <ThemeProvider>
        <Aside />
      </ThemeProvider>
    </MemoryRouter>
  );
  const btn = screen.getByRole('button', { name: /home/i });
  fireEvent.click(btn);
  expect(mockNavigate).toHaveBeenCalledWith('/content');
});
