// TDD test for LoginForm component
// Copilot generated initial test structure and logic
// Human refined the test, added mocks, and ensured it covers login flow
// 60% AI-generated, 40% human refined

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../components/loginAndRegistration/LoginForm';
import { ThemeProvider } from '../theme/ThemeContext';

// Mock the API helper
const loginMock = jest.fn();
jest.mock('../api/auth/login', () => ({
  login: () => loginMock(),
}));

// Mock useNavigate to observe navigation
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('LoginForm (TDD)', () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  beforeEach(() => {
    mockedNavigate.mockClear();
    loginMock.mockClear();
    localStorageMock.clear.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('logs in with username/password, saves jwt, and navigates to /content', async () => {
    // Setup the mock return value
    loginMock.mockResolvedValueOnce({
      token: 'fake-jwt',
      raw: { success: true, result: { jwt: 'fake-jwt' } },
    });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <LoginForm showSubmitButton />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Fill username and password
    await userEvent.type(screen.getByLabelText(/email address/i), 'pedrotest');
    await userEvent.type(screen.getByLabelText(/password/i), 'pedro123');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert jwt saved
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('jwt', 'fake-jwt');
    });

    // Navigated to /content
    expect(mockedNavigate).toHaveBeenCalledWith('/content', { replace: true });
  });

  it('shows validation errors when fields are empty', async () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <LoginForm showSubmitButton />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Submit without filling fields
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for validation error messages
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    // Verify login was not called
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('shows error message when login fails', async () => {
    // Setup the mock to reject
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <ThemeProvider>
          <LoginForm showSubmitButton />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Fill username and password
    await userEvent.type(screen.getByLabelText(/email address/i), 'pedrotest');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    // Verify we didn't navigate
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
