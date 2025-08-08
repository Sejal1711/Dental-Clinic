import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import './AdminHome.css'; 
import AdminDashboard from '../components/AdminDashboard';

const AdminHome = () => {
  return (
    <div>
      
      <div className="dashboard-content">
        <h2>Welcome, Admin</h2>
        <p className="hi">Use the navbar to manage slots and view appointments.</p>
        <AdminDashboard/>
      </div>
    </div>
  );
};

export default AdminHome;
