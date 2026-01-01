import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      login(response.data, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center" 
      style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem'
      }}
    >
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div 
              className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
              style={{ width: '60px', height: '60px', fontSize: '28px', fontWeight: 'bold' }}
            >
              V
            </div>
            <h2 className="mb-2 fw-bold" style={{ color: '#5e5873', fontSize: '1.5rem' }}>Create Account</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Fill below form to create new account</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold" style={{ color: '#5e5873' }}>Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Enter your name"
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#5e5873' }}>Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Enter your email"
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#5e5873' }}>Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Enter your password"
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-semibold" style={{ color: '#5e5873' }}>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
                placeholder="Confirm your password"
                style={{ fontSize: '0.875rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={loading}
              style={{ padding: '0.75rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
