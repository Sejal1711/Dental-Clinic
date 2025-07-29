import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import AdminHome from './pages/AdminHome';
import ViewAppointments from './pages/ViewAppointments'; // <-- add this
// import AddSlot and DeleteSlot if created

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const userType = localStorage.getItem('userType');

  return (
    <div className="bg-background min-h-screen">
      {userType !== 'admin' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<BookAppointment />} />

        {/* Admin Routes */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/appointments" element={<ViewAppointments />} />
        {/* Add these when ready: */}
        {/* <Route path="/admin/slots" element={<AddSlot />} /> */}

      </Routes>
    </div>
  );
}

export default App;
