import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './form.css'; 

const BookAppointment = () => {
  const [date, setDate] = useState('');
  const [slotId, setSlotId] = useState('');
  const [reason, setReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) return;
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5050/api/slots?date=${date}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('patientToken')}`,
          },
        });
        setAvailableSlots(res.data || []);
        setMessage('');
      } catch (error) {
        setMessage('Failed to load slots.');
        setAvailableSlots([]);
      }
      setLoading(false);
    };

    fetchSlots();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slotId) return setMessage('Please select a time slot');

    // Find the selected slot to get its timeSlot string
    const selectedSlot = availableSlots.find(slot => slot._id === slotId);
    if (!selectedSlot) {
      setMessage('Invalid time slot selected');
      return;
    }

    const timeSlot = selectedSlot.timeSlot;

    try {
      const res = await axios.post(
        'http://localhost:5050/api/appointments/book',
        {
          date,
          timeSlot, // <-- sending timeSlot now
          name,
          email,
          phone,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('patientToken')}`,
          },
        }
      );

      setMessage('Appointment booked successfully!');
      setDate('');
      setSlotId('');
      setReason('');
      setName('');
      setEmail('');
      setPhone('');
      setAvailableSlots([]);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Book Appointment</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Phone:</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Choose Slot:</label>
        <select value={slotId} onChange={(e) => setSlotId(e.target.value)} required>
          <option value="">Select a slot</option>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <option key={slot._id} value={slot._id}>
                {slot.timeSlot}
              </option>
            ))
          ) : (
            <option disabled>No slots available</option>
          )}
        </select>

        <label>Reason (optional):</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for visit"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
