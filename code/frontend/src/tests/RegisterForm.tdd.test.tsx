import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../components/loginAndRegistration/RegisterForm';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext';

/*
AI-generated code: 70% (tool: ChatGPT, adapted; helper fill function, structure of test case)
Human code: 25% (custom assertion flow, expected form submission payloads)
Framework-generated code: 5% (React Testing Library, Jest DOM APIs)
*/

function fill(input: HTMLElement, value: string) {
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
}


test('requires name, email, password; submits when valid', () => {
  const onSubmit = jest.fn();
  render(
    <MemoryRouter>
      <ThemeProvider>
        <RegisterForm onSubmit={onSubmit} showSubmitButton />
      </ThemeProvider>
    </MemoryRouter>
  );


  const name = screen.getByLabelText(/name/i);
  const email = screen.getByLabelText(/^email$/i);
  const password = screen.getByLabelText(/password/i);


  // Trigger errors
  fireEvent.blur(name);
  fireEvent.blur(email);
  fireEvent.blur(password);
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  expect(screen.getByText(/password is required/i)).toBeInTheDocument();


  // Fill valid values and submit
  fill(name, 'James');
  fill(email, 'james@example.com');
  fill(password, 'secret123');
  fireEvent.click(screen.getByRole('button', { name: /register/i }));
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'James',
    email: 'james@example.com',
    password: 'secret123'
  });
});
