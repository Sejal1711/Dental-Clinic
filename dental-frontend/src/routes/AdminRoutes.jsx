import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHome from '../pages/AdminHome';
import ViewAppointments from '../pages/ViewAppointments';
import DoctorSchedule from '../components/DoctorSchedule';
import AllAppointments from '../pages/allapointments'; // ✅ updated

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/appointments" element={<ViewAppointments />} />
      <Route path="/admin/slots" element={<DoctorSchedule />} />
      <Route path="/admin/all-appointments" element={<AllAppointments />} />
    </Routes>
  );
};

export default AdminRoutes;
