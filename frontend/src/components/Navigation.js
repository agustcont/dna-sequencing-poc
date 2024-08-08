// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation({ isAuthenticated, role, onLogout }) {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
        {!isAuthenticated && <li><Link to="/register">Register</Link></li>}
        {isAuthenticated && role === 'business' && <li><Link to="/submit-sample">Submit Sample</Link></li>}
        {isAuthenticated && <li><Link to="/view-samples">View Samples</Link></li>}
        {isAuthenticated && <li><button onClick={onLogout}>Logout</button></li>}
      </ul>
    </nav>
  );
}

export default Navigation;
