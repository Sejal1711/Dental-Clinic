// src/pages/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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
          `${import.meta.env.VITE_API_URL}/api/slots?date=${date}&availableOnly=true`,
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
        `${import.meta.env.VITE_API_URL}/api/appointments/book`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl font-bold">🦷</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Book Your Dental Appointment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule your visit with our experienced dental professionals. We're here to help you achieve a healthy, beautiful smile.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Message */}
          {message && (
            <div className={`rounded-lg p-4 mb-8 ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {messageType === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                )}
                <span className={`text-sm ${
                  messageType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {message}
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={minDate}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Appointment Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Available Time Slots
                  </label>
                  <select
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    required
                    disabled={!date || slotLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Reason for Visit (Optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please describe your dental concerns or the reason for your visit"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
