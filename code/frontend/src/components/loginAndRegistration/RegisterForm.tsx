import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link to navigate to Login page
import { isRequired, isEmail } from './validation'; // keep path simple (no .ts extension)
import {
  register as registerRequest,
  type RegisterPayload,
} from '../../api/auth/register';

/*
 AI-generated code: ~65% 
   - Tool: ChatGPT (link: https://chatgpt.com/share/68d43c9d-4d60-8006-a1a7-14ae49475a5a)
   - Modified and adapted by human
   - Functions/classes: RegisterForm component structure, validation integration, JSX layout
 Human code (James Rose): ~35% 
   - Adjustments: footer text "Already have an account?", fixed link targets, applied centering card layout
   - Functions/classes: human refinements for props, consistent styling with LoginForm
 Framework-generated code: 0%
   - (React/Bootstrap boilerplate is used but not auto-generated)
*/

type RegisterValues = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'EMPLOYEE';
};
type Props = {
  onSubmit?: (values: RegisterValues) => void;
  showSubmitButton?: boolean;
};

// Register form with name, email, and password inputs
// Mirrors LoginForm but adds "name" field
const RegisterForm: React.FC<Props> = ({
  onSubmit,
  showSubmitButton = false,
}) => {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterValues>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'EMPLOYEE',
  });

  // Track touched fields for showing validation feedback
  const [touched, setTouched] = useState<Record<keyof RegisterValues, boolean>>(
    {
      username: false,
      email: false,
      password: false,
      firstName: false,
      lastName: false,
      userType: false,
    }
  );

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Validation: all fields required, email must match format
  const errors = {
    username: !isRequired(values.username) ? 'Username is required' : '',
    email: !isRequired(values.email)
      ? 'Email is required'
      : !isEmail(values.email)
      ? 'Enter a valid email'
      : '',
    password: !isRequired(values.password) ? 'Password is required' : '',
    firstName: !isRequired(values.firstName) ? 'First name is required' : '',
    lastName: !isRequired(values.lastName) ? 'Last name is required' : '',
    userType: !isRequired(values.userType) ? 'User type is required' : '',
  } as const;

  const hasError = (field: keyof RegisterValues) =>
    touched[field] && !!errors[field];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setTouched({ ...touched, [e.target.name]: true as any });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      username: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      userType: true,
    });
    setServerError(null);
    setSuccessMsg(null);

    const valid =
      !errors.username &&
      !errors.email &&
      !errors.password &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.userType;

    if (!valid) return;

    if (onSubmit) onSubmit(values);

    try {
      setLoading(true);
      const payload: RegisterPayload = {
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        userType: 'EMPLOYEE',
      };

      await registerRequest(payload);
      setSuccessMsg('Registration successful. Please log in.');
      navigate('/login', { replace: true });
    } catch (err: any) {
      setServerError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Center the card regardless of parent layout; prevent squish
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ width: '100vw', padding: '1rem' }}
    >
      {/* Subtle card container around the form */}
      <div className="card shadow-sm" style={{ width: 380, maxWidth: '100%' }}>
        <div className="card-body">
          {/* App/logo image at top (served from /public) */}

          <h2 className="h4 text-center mb-4">Register</h2>

          {serverError && (
            <div className="alert alert-danger py-2" role="alert">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success py-2" role="alert">
              {successMsg}
            </div>
          )}

          <form className="w-100" noValidate onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="regUsername" className="form-label">
                Username
              </label>
              <input
                id="regUsername"
                name="username"
                type="text"
                className={`form-control ${
                  hasError('username') ? 'is-invalid' : ''
                }`}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Choose a username"
                required
              />
              {hasError('username') && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="regEmail" className="form-label">
                Email
              </label>
              <input
                id="regEmail"
                name="email"
                type="email"
                className={`form-control ${
                  hasError('email') ? 'is-invalid' : ''
                }`}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@example.com"
                required
              />
              {hasError('email') && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="regPassword" className="form-label">
                Password
              </label>
              <input
                id="regPassword"
                name="password"
                type="password"
                className={`form-control ${
                  hasError('password') ? 'is-invalid' : ''
                }`}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password"
                required
              />
              {hasError('password') && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="regFirstName" className="form-label">
                First name
              </label>
              <input
                id="regFirstName"
                name="firstName"
                type="text"
                className={`form-control ${
                  hasError('firstName') ? 'is-invalid' : ''
                }`}
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="First name"
                required
              />
              {hasError('firstName') && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="regLastName" className="form-label">
                Last name
              </label>
              <input
                id="regLastName"
                name="lastName"
                type="text"
                className={`form-control ${
                  hasError('lastName') ? 'is-invalid' : ''
                }`}
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Last name"
                required
              />
              {hasError('lastName') && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>

            {/* Black, full-width register button (rendered only if allowed by story flag) */}
            {showSubmitButton && (
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? 'Registering…' : 'Register'}
              </button>
            )}
          </form>

          {/* Small footer text with link to Login page */}
          <p className="text-center mt-3 mb-0 small">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
