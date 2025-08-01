import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorSchedule.css';

const DoctorSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch slots when selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchSlotsByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlotsByDate = async (date) => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setMessage('Admin not authenticated. Please log in.');
        return;
      }

      const response = await axios.get(
        `http://localhost:5050/api/slots?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSlots(response.data || []);
      setMessage('');
      console.log("Fetched slots:", response.data);

    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
      setMessage('Failed to fetch slots.');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setMessage('Admin not authenticated. Please log in.');
        return;
      }

      await axios.delete(`http://localhost:5050/api/slots/${slotId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchSlotsByDate(selectedDate); // Refresh after delete
    } catch (error) {
      console.error('Error deleting slot:', error);
      setMessage('Failed to delete slot.');
    }
  };

  const handleDeleteAllByDate = async () => {
    if (!selectedDate) {
      setMessage('Please select a date first.');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `http://localhost:5050/api/slots/day?date=${selectedDate}`,
        config
      );

      setMessage(response.data.message || 'All slots deleted successfully.');
      fetchSlotsByDate(selectedDate); // Refresh after bulk delete
    } catch (error) {
      console.error('Error deleting all slots by date:', error);
      setMessage(error?.response?.data?.message || 'Error deleting slots.');
    }
  };

  return (
    <div className="container">
      <h2>Doctor Slot Manager</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {message && <p className="message">{message}</p>}

      <ul className="slot-list">
        {slots.length === 0 && selectedDate && <p>No slots found for this date.</p>}

        {slots.map((slot) => (
          <li key={slot._id}>
            <span>
              {slot.timeSlot} {slot.booked ? '(Booked)' : ''}
            </span>
            <button className="delete-btn" onClick={() => handleDeleteSlot(slot._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {slots.length > 0 && (
        <button className="delete-all-btn" onClick={handleDeleteAllByDate}>
          Delete All Slots for This Date
        </button>
      )}
    </div>
  );
};

export default DoctorSchedule;
