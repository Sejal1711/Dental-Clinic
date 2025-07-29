import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <ul>
        <li>
          <NavLink to="/admin">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/admin/appointments">Appointments</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
