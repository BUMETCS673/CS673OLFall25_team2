/*
 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as apiClient from '../api/apiClient';
import { ThemeProvider } from '../theme/ThemeContext';

// Import all the components we will need for our routes
import Unauthorized401 from '../components/401-404/Unauthorized401';
import NotFound404 from '../components/401-404/NotFound404';
import MyJobs from '../pages/MyJobs';

const Home = () => <div>Welcome Home</div>;

// We only need to mock our API client module.
jest.mock('../api/apiClient');

const renderWithRouter = (initialRoute: string) => {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/unauthorized" element={<Unauthorized401 />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('Routing and Error Handling', () => {
  const mockedFetchWithAuth = apiClient.fetchWithAuth as jest.Mock;

  beforeEach(() => {
    mockedFetchWithAuth.mockReset();
  });

  test('simulated 401 after clicking button navigates to /unauthorized', async () => {
    // Arrange
    mockedFetchWithAuth.mockImplementation(
      (url: string, options: object, navigate?: Function) => {
        if (navigate) {
          navigate('/unauthorized');
        }
        return Promise.reject(new Error('Unauthorized'));
      }
    );

    // Act 1: Render the page
    renderWithRouter('/my-jobs');

    // Act 2: Find and click the button to trigger the API call
    const fetchButton = screen.getByRole('button', { name: /Fetch Jobs/i });
    await userEvent.click(fetchButton);

    // Assert: Wait for the heading of the NEW page to appear
    const heading = await screen.findByRole('heading', {
      name: /Unauthorized Access/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test('visiting an unknown route renders NotFound404 and can navigate home', async () => {
    renderWithRouter('/some-page-that-does-not-exist');

    const heading = await screen.findByRole('heading', {
      name: /Page Not Found/i,
    });
    expect(heading).toBeInTheDocument();

    const goHomeLink = screen.getByRole('link', { name: /Go Home/i });
    await userEvent.click(goHomeLink);

    expect(await screen.findByText(/Welcome Home/i)).toBeInTheDocument();
  });
});