import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      login(response.data, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
            <h2 className="mb-2 fw-bold" style={{ color: '#5e5873', fontSize: '1.5rem' }}>Welcome Back</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Please sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit}>
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

            <div className="mb-4">
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

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={loading}
              style={{ padding: '0.75rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
