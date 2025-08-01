import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Add styling as needed

const AdminDashboard = () => {
  const [todaysAppointments, setTodaysAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/appointments/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodaysAppointments(res.data);
      } catch (err) {
        console.error('Error fetching today’s appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="dashboard-container">
      
<h2>Today's Appointments</h2>
      <div className="card-container">
        <div className="card">
          
          {todaysAppointments.length === 0 ? (
            <p>No appointments for today</p>
          ) : (
            <ul className="appointment-list">
              {todaysAppointments.map((appt) => (
                <li key={appt._id}>
                    
                  <strong>Time:</strong> {appt.timeSlot}<br />
                  <strong>Reason:</strong> {appt.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
