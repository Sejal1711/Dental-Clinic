import React, { useEffect, useState } from 'react';

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

        const now = new Date();
        const upcoming = res.data.filter((appt) => new Date(appt.date) >= now);
        setAppointments(upcoming);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      
      <div className="appointments-container">
        <h2>Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <ul>
            {appointments.map((appt) => (
              <li key={appt._id}>
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

export default ViewAppointments;
