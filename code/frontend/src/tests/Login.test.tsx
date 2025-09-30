/*
  AI-generated code: 80% Tool: GPT
  Human code: 20% Logic (adapted to LoginForm.tsx by a human)
  Framework-generated code: 0%
*/

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/loginAndRegistration/LoginForm';

// Mock the module containing the loginRequest function
// This is more robust than mocking global 'fetch' as it directly targets the component's dependency.
jest.mock('../api/auth/login', () => ({ // <-- CORRECTED PATH
  login: jest.fn(),
}));

// Import the mock after defining it
import { login as mockLoginRequest } from '../api/auth/login'; // <-- CORRECTED PATH

// Mock react-router-dom's useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import and retain all actual functionalities
  useNavigate: () => mockedNavigate, // But hijack useNavigate
  Link: (props: any) => <a {...props}>{props.children}</a>, // Simple mock for Link component
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    (mockLoginRequest as jest.Mock).mockClear();
    mockedNavigate.mockClear();
    jest.spyOn(Storage.prototype, 'setItem').mockClear();
    jest.spyOn(Storage.prototype, 'getItem').mockClear();
  });

  // Test 1: Client-side validation for empty fields
  test('should show validation errors if username or password are empty', async () => {
    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    // Assert error messages are shown and API was not called
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockLoginRequest).not.toHaveBeenCalled();
  });

  // Test 2: Successful login flow
  test('should call login API, store token, and navigate on successful submission', async () => {
    // Mock a successful API response
    (mockLoginRequest as jest.Mock).mockResolvedValue({
      token: 'fake-jwt-token',
      raw: { user: 'testuser' },
    });

    // Spy on localStorage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    // Fill out the form with valid credentials
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assert that the API was called correctly
    await waitFor(() => {
      expect(mockLoginRequest).toHaveBeenCalledWith('testuser', 'password123');
    });

    // Assert success message is displayed
    expect(await screen.findByText('Logged in successfully. Token saved.')).toBeInTheDocument();

    // Assert that the token was stored and navigation occurred
    expect(setItemSpy).toHaveBeenCalledWith('jwt', 'fake-jwt-token');
    expect(setItemSpy).toHaveBeenCalledWith('auth', JSON.stringify({ user: 'testuser' }));
    expect(mockedNavigate).toHaveBeenCalledWith('/content', { replace: true });

    setItemSpy.mockRestore(); // Clean up spy
  });

  // Test 3: API error handling (e.g., invalid credentials)
  test('should show an alert on API error', async () => {
    // Mock a failed API response
    const errorMessage = 'Invalid credentials';
    (mockLoginRequest as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the error message to appear and assert it has role="alert"
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(errorMessage);
  });

  // Test 4: Submit button disabled while in-flight
  test('should disable the submit button while the form is submitting', async () => {
    // Create a mock API call that takes time to resolve
    (mockLoginRequest as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ token: 'token', raw: {} }), 100))
    );

    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    // Immediately after clicking, the button should be disabled and the text should change
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Logging in…');

    // Wait for the process to complete, and the button should be re-enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Login');
    });
  });
});