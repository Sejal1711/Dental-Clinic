// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import AdminHome from './pages/AdminHome';
import ViewAppointments from './pages/ViewAppointments';
import DoctorSchedule from './components/DoctorSchedule';

function App() {
  const location = useLocation();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const isAdmin = userType === 'admin';

  return (
    <div className="bg-background min-h-screen">
      {location.pathname.startsWith('/admin') && isAdmin ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<BookAppointment />} />

        {/* Admin Routes */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/appointments" element={<ViewAppointments />} />
        <Route path="/admin/slots" element={<DoctorSchedule />} />
      </Routes>
    </div>
  );
}

export default App;
