// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import AdminHome from './pages/AdminHome';
import DoctorSchedule from './pages/DoctorSchedule';
import AllAppointments from './pages/AllAppointments';
import AdminDashboard from './components/AdminDashboard'; 
import PatientDashboard from './pages/PatientDashboard';
function App() {
  const location = useLocation();
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const isAdmin = userType === 'admin';

  return (
    <div className="bg-background min-h-screen " >
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

        {/* Admin routes */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/appointments" element={<AllAppointments />} />
        <Route path="/admin/slots" element={<DoctorSchedule />} />
        <Route path="/patient/dashboard" element={<PatientDashboard/>}/>
      </Routes>

      <Footer/>
    </div>
    
  );
}

export default App;
