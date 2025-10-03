/* src/tests/Registration.test.tsx

 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../components/loginAndRegistration/RegisterForm';

// Mock the global fetch function
global.fetch = jest.fn();

// Mock react-router-dom's useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  Link: (props: any) => <a {...props}>{props.children}</a>,
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockedNavigate.mockClear();
  });

  test('should show validation errors for required fields', () => {
    render(
      <BrowserRouter>
        <RegisterForm showSubmitButton={true} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should call register API and navigate to login on successful submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User registered successfully' }),
    });

    render(
      <BrowserRouter>
        <RegisterForm showSubmitButton={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'John Doe', email: 'john@example.com', password: 'password123' }),
      });
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/'); // Navigate to login page
  });

  test('should show an inline error on 409 duplicate email', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ message: 'Email already exists' }),
    });

    render(
      <BrowserRouter>
        <RegisterForm showSubmitButton={true} />
      </BrowserRouter>
    );
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Email already exists');
  });

  test('should disable the submit button while submitting', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    );

    render(
      <BrowserRouter>
        <RegisterForm showSubmitButton={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@user.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});