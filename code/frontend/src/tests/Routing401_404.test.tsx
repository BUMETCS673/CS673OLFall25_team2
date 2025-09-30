/* src/tests/Registration.test.tsx

 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as myJobsApi from '../api/pages/myJobs';
import { ThemeProvider } from '../theme/ThemeContext';

import Unauthorized401 from '../components/401-404/Unauthorized401';
import NotFound404 from '../components/401-404/NotFound404';
import MyJobs from '../pages/MyJobs';

const Home = () => <div>Welcome Home</div>;

jest.mock('../api/pages/myJobs');

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
  const mockedGetMySaved = myJobsApi.getMySaved as jest.Mock;

  beforeEach(() => {
    mockedGetMySaved.mockReset();
  });

  test('should display an error message on the page when the API fails', async () => {
    const errorMessage = 'You do not have permission to access this';
    mockedGetMySaved.mockRejectedValue({
      message: errorMessage,
    });

    renderWithRouter('/my-jobs');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(errorMessage);

    const unauthorizedHeading = screen.queryByRole('heading', {
      name: /Unauthorized Access/i,
    });
    expect(unauthorizedHeading).not.toBeInTheDocument();
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