import React, { useEffect, useState } from 'react';

import axios from 'axios';
import './AllAppointments.css'; // ✅ assuming you'll use this for CSS

const AllAppointments = () => {
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

      // Proper Date comparison
      const upcoming = res.data.filter(appt => {
        const apptDate = new Date(appt.date);
        const now = new Date();
        return apptDate >= now && appt.status !== 'done';
      });

      setAppointments(upcoming);
    } catch (error) {
      console.error('Error fetching all appointments:', error);
    }
  };

  fetchAppointments();
}, []);


  return (
    <div>
      
      <div className="appointments-container">
        <h2>Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p>No upcoming appointments found.</p>
        ) : (
          <ul>
            {appointments.map((appt) => (
              <li key={appt._id} className="appointment-item">
                <strong>Patient:</strong> {appt.patientName}<br />
                <strong>Date:</strong> {appt.date}<br />
                <strong>Time:</strong> {appt.time}<br />
                <strong>Slot ID:</strong> {appt.slotId}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
