import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm'; // Assuming this is your login component
import SuccessPage from './SuccessPage';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/success" element={
        <ProtectedRoute>
          <SuccessPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
