import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5130/api/Auth/login', {
        username,
        password
      });

      const token = response.data?.token;
      const user = response.data?.username ?? 'Unknown';

      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');

      if (rememberMe) {
        localStorage.setItem('rememberedUser', username);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      setSuccess('Login successful.');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay" />
      <div className="login-box" role="main" aria-labelledby="login-heading">
        <h2 id="login-heading">Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username" className="visually-hidden">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
            aria-required="true"
            aria-invalid={!!fieldErrors.username}
            aria-describedby="username-error"
          />
          {fieldErrors.username && (
            <p className="error-msg" id="username-error">{fieldErrors.username}</p>
          )}

          <label htmlFor="password" className="visually-hidden">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!!fieldErrors.password}
              aria-describedby="password-error"
            />
            <button
              type="button"
              className="toggle-password"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((show) => !show)}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="error-msg" id="password-error">{fieldErrors.password}</p>
          )}

          <div className="options-row">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>

          {error && (
            <p id="error-msg" className="error-msg" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          {success && (
            <p className="success-msg" role="status" aria-live="polite">
              {success}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;