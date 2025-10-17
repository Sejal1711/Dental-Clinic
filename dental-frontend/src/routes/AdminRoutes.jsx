import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHome from '../pages/AdminHome';
import DoctorSchedule from '../pages/DoctorSchedule';
import AllAppointments from '../pages/AllAppointments';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/appointments" element={<AllAppointments />} />
      <Route path="/admin/slots" element={<DoctorSchedule />} />
    </Routes>
  );
};

export default AdminRoutes;
