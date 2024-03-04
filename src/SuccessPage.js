import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function SuccessPage() {
  const navigate = useNavigate();

  const logout = () => {
    // Clear the loggedIn flag
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    // Redirect to login page using React Router
    navigate('/');
  };

  return (
    <div className="login-container">
      <h2>Login Successful</h2>
      <p>Welcome {localStorage.getItem('userEmail')}! You have successfully logged in.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default SuccessPage;
