// src/pages/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./form.css";

// import DentalMouthEmbed from '../components/DentalMouthEmbed';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const BookAppointment = () => {
  const [date, setDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [reason, setReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false); // submit loading
  const [slotLoading, setSlotLoading] = useState(false); // loading for slot fetch

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      if (!date) {
        setAvailableSlots([]);
        return;
      }

      setSlotLoading(true);
      setMessage('');
      setMessageType('');

      try {
        const res = await axios.get(
          `http://localhost:5050/api/slots?date=${date}&availableOnly=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('patientToken')}`,
            },
          }
        );

        // Expecting res.data.slots to be an array like [{time, isBooked}, ...]
        const slots = res.data?.slots || [];
        // Keep only available slots (not booked)
        const available = slots.filter((s) => !s.isBooked);
        setAvailableSlots(available);
      } catch (error) {
        console.error('Failed to load slots', error);
        setMessage('Failed to load slots.');
        setMessageType('error');
        setAvailableSlots([]);
      } finally {
        setSlotLoading(false);
      }
    };

    fetchSlots();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slotTime) {
      setMessage('Please select a time slot');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      await axios.post(
        `http://localhost:5050/api/appointments/book`,
        {
          date,
          timeSlot: slotTime,
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

      setMessage('Appointment booked successfully! We will send you a confirmation email shortly.');
      setMessageType('success');

      // reset form
      setDate('');
      setSlotTime('');
      setReason('');
      setName('');
      setEmail('');
      setPhone('');
      setAvailableSlots([]);
    } catch (err) {
      console.error('Booking failed', err);
      setMessage(err.response?.data?.message || 'Booking failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // helper: min date for date input (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1 className="header-title">Book Your Dental Appointment</h1>
        <p className="header-subtitle">Schedule your visit with our experienced dental professionals</p>
      </div>

      <div className="appointment-form-container">
        <div className="form-header">
          <div>
            <h2>Appointment Details</h2>
            <p className="text-muted">Pick a date and slot, fill your contact details and describe the issue.</p>
          </div>

          {/* 3D mouth embed on the right (or below on small screens)
          <div style={{ width: 360, maxWidth: '40%', minWidth: 280 }}>
            <DentalMouthEmbed />
          </div> */}
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {messageType === 'success' ? (
              <CheckCircle className="message-icon" />
            ) : (
              <AlertCircle className="message-icon" />
            )}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-row">
            <div className="input-group">
              <label>
                <User className="label-icon" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <Mail className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>
                <Phone className="label-icon" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <Calendar className="label-icon" />
                Preferred Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>
              <Clock className="label-icon" />
              Available Time Slots
            </label>
            <select
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              required
              disabled={!date || slotLoading}
            >
              <option value="">
                {!date ? 'Please select a date first' : slotLoading ? 'Loading slots...' : 'Select a time slot'}
              </option>

              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <option key={index} value={slot.time}>
                    {slot.time}
                  </option>
                ))
              ) : (
                !slotLoading && <option disabled>No slots available</option>
              )}
            </select>
          </div>

          <div className="input-group">
            <label>
              <FileText className="label-icon" />
              Reason for Visit (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your dental concerns or the reason for your visit"
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              'Book Appointment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
