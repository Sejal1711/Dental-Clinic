import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('patientToken');
        const res = await axios.get('http://localhost:5050/api/patients/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatient(res.data);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading your dashboard...</p>;

  if (!patient) return <p>Failed to load patient data.</p>;

  return (
    <div className="dashboard">
      <h2>Welcome, {patient.name}</h2>
      <p>Email: {patient.email}</p>

      <h3>Your Appointments:</h3>
      {patient.appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {patient.appointments.map((appt) => (
            <li key={appt._id}>
              <strong>Date:</strong> {new Date(appt.date).toLocaleString()}<br />
              <strong>Reason:</strong> {appt.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientDashboard;
