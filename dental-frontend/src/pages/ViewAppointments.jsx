import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import axios from 'axios';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('/api/admin/appointments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="appointments-container">
        <h2>Booked Appointments</h2>
        <ul>
          {appointments.map((appt) => (
            <li key={appt._id}>
              <strong>Patient:</strong> {appt.patientName}<br />
              <strong>Time:</strong> {appt.time}<br />
              <strong>Slot ID:</strong> {appt.slotId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewAppointments;
