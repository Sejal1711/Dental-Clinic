import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const DoctorSchedule = () => {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState('');

  const token = localStorage.getItem('adminToken');

  const fetchSlots = async () => {
    try {
      const res = await axios.get('/api/admin/slots', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlot = async () => {
    try {
      await axios.post(
        '/api/admin/slots',
        { time: newSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSlot('');
      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlots();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <h2>Manage Doctor Slots</h2>
      <input
        type="text"
        placeholder="Enter slot time"
        value={newSlot}
        onChange={(e) => setNewSlot(e.target.value)}
      />
      <button onClick={handleAddSlot}>Add Slot</button>
      <ul>
        {slots.map((slot) => (
          <li key={slot._id}>
            {slot.time} <button onClick={() => handleDelete(slot._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorSchedule;
