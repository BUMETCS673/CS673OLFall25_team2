// RegisterForm.tsx
// Copilot assisted with this component
// 70% AI-generated, 30% human refined

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isRequired, isEmail } from './validation';
import {
  register as registerRequest,
  type RegisterPayload,
} from '../../api/auth/register';

type RegisterValues = {
  name: string;
  email: string;
  password: string;
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
    name: '',
    email: '',
    password: '',
  });

  // Track touched fields for showing validation feedback
  const [touched, setTouched] = useState<Record<keyof RegisterValues, boolean>>(
    {
      name: false,
      email: false,
      password: false,
    }
  );

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Validation: all fields required, email must match format
  const errors = {
    name: !isRequired(values.name) ? 'Full name is required' : '',
    email: !isRequired(values.email)
      ? 'Email is required'
      : !isEmail(values.email)
      ? 'Enter a valid email'
      : '',
    password: !isRequired(values.password) ? 'Password is required' : '',
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
      name: true,
      email: true,
      password: true,
    });
    setServerError(null);
    setSuccessMsg(null);

    const valid = !errors.name && !errors.email && !errors.password;

    if (!valid) return;

    if (onSubmit) onSubmit(values);

    try {
      setLoading(true);

      const payload: RegisterPayload = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      try {
        const result = await registerRequest(payload);
        console.log('Registration successful:', result);

        setSuccessMsg('Registration successful. Please log in.');

        // Navigate after a slight delay to allow the user to see the success message
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } catch (error: any) {
        console.error('Registration error:', error);
        if (error.status === 409) {
          setServerError('This email is already registered');
        } else {
          setServerError(
            error?.message || 'Registration failed. Please try again.'
          );
        }
      }
    } catch (err: any) {
      console.error('Registration form error:', err);
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
              <label htmlFor="regName" className="form-label">
                Full Name
              </label>
              <input
                id="regName"
                name="name"
                type="text"
                className={`form-control ${
                  hasError('name') ? 'is-invalid' : ''
                }`}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your full name"
                required
              />
              {hasError('name') && (
                <div className="invalid-feedback">{errors.name}</div>
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
                placeholder="*****************"
                required
              />
              {hasError('password') && (
                <div className="invalid-feedback">{errors.password}</div>
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
            Already have an account?{' '}
            <Link to="/login">
              <span className="text-info">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
