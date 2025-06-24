import React, { useState } from 'react';
import './Login.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }

  

    setSuccess('Password reset link has been sent to your email.');
  };

  return (
    <div className="login-page">
      <div className="overlay" />
      <div className="login-box" role="main" aria-labelledby="forgot-heading">
        <h2 id="forgot-heading">Forgot Password</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className="visually-hidden">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby="email-error"
          />
          {error && (
            <p id="email-error" className="error-msg" role="alert">{error}</p>
          )}

          {success && (
            <p className="success-msg" role="status" aria-live="polite">{success}</p>
          )}

          <button type="submit">Send Reset Link</button>
        </form>

        <p style={{ marginTop: '1rem' }}>
          <a href="/" style={{ color: '#2575fc', textDecoration: 'underline' }}>
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;