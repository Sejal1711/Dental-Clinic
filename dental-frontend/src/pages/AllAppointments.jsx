import React, { useEffect, useState } from 'react';
import './AllAppointments.css';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('Admin not logged in or token missing.');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch appointments');
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h2>All Appointments</h2>
      {error && <p className="error">{error}</p>}
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.user?.name}</td>
                <td>{appointment.user?.email}</td>
                <td>{appointment.date}</td>
                <td>{appointment.timeSlot}</td>
                <td>{appointment.reason || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllAppointments;
