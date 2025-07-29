import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5050/api/admin/appointments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>All Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.patientName}</td>
                <td>{appt.date}</td>
                <td>{appt.slotTime}</td>
                <td>{appt.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllAppointments;
