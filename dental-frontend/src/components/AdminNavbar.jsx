// src/components/AdminNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css'; // Assuming you have some styles for the admin navbar
const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <ul>
        <li><Link to="/admin/home">Admin Home</Link></li>
        <li><Link to="/admin/appointments">Appointments</Link></li>
        <li><Link to="/admin/slots">Manage Slots</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
