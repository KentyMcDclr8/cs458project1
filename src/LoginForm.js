import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import './App.css';
import { onSignIn } from './onSignIn';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (onSignIn(email, password)) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/success'); // Navigate to success page
    } else {
      alert('Invalid email address or password. Please try again.');
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email
    console.log(decoded);
    if (decoded.email_verified && onSignIn(email)) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/success'); // Navigate to success page
    } else {
      alert('User account does not exist for this Gmail. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <div id='google_login_button'>
      <GoogleLogin
        onSuccess={credentialResponse => handleGoogleLogin(credentialResponse)}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      </div>
    </div>
  );
}

export default LoginForm;
