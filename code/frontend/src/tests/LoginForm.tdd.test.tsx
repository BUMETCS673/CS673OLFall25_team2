// TDD test for LoginForm component
// Copilot generated initial test structure and logic
// Human (Pedro) refined the test, added mocks, and ensured it covers login flow
// 60% AI-generated, 40% human refined

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../components/loginAndRegistration/LoginForm';

// Mock the API helper
jest.mock('../api/auth/login', () => ({
  login: jest.fn(async (_username: string, _password: string) => ({
    token: 'fake-jwt',
    raw: { success: true, result: { jwt: 'fake-jwt' } },
  })),
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
  beforeEach(() => {
    mockedNavigate.mockClear();
    localStorage.clear();
  });

  it('logs in with username/password, saves jwt, and navigates to /content', async () => {
    render(
      <MemoryRouter>
        <LoginForm showSubmitButton />
      </MemoryRouter>
    );

    // Fill username and password
    await userEvent.type(screen.getByLabelText(/username/i), 'pedrotest');
    await userEvent.type(screen.getByLabelText(/password/i), 'pedro123');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert jwt saved
    await waitFor(() => {
      expect(localStorage.getItem('jwt')).toBe('fake-jwt');
    });

    // Navigated to /content
    expect(mockedNavigate).toHaveBeenCalledWith('/content', { replace: true });
  });
});
