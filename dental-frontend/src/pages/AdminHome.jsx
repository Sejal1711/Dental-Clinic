import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import './AdminHome.css'; // Ensure this path is correct

const AdminHome = () => {
  return (
    <div>
      
      <div className="dashboard-content">
        <h2>Welcome, Admin</h2>
        <p>Use the navbar to manage slots and view appointments.</p>
      </div>
    </div>
  );
};

export default AdminHome;
