import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Trash2, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';

const DoctorSchedule = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [showAddSlot, setShowAddSlot] = useState(false);

  // Fetch slots when selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchSlotsByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlotsByDate = async (date) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setMessage('Admin not authenticated. Please log in.');
        setMessageType('error');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/slots?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // The API returns an object with slots array, not just the array
      const slotsData = response.data?.slots || [];
      setSlots(slotsData);
      setMessage('');
      setMessageType('');
      console.log("Fetched slots:", response.data);

    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
      setMessage('Failed to fetch slots.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotTime) => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setMessage('Admin not authenticated. Please log in.');
        setMessageType('error');
        return;
      }

      // Since slots are stored as arrays, we need to remove the time from the array
      // This would require a new API endpoint or we can just refresh the page
      // For now, let's just show a message that individual slot deletion isn't supported
      setMessage('Individual slot deletion is not supported. Use "Delete All" to remove all slots for this date.');
      setMessageType('error');
    } catch (error) {
      console.error('Error deleting slot:', error);
      setMessage('Failed to delete slot.');
      setMessageType('error');
    }
  };

  const handleDeleteAllByDate = async () => {
    if (!selectedDate) {
      setMessage('Please select a date first.');
      setMessageType('error');
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
       `${import.meta.env.VITE_API_URL}/api/slots/day?date=${selectedDate}`,
        config
      );

      setMessage(response.data.message || 'All slots deleted successfully.');
      setMessageType('success');
      fetchSlotsByDate(selectedDate); // Refresh after bulk delete
    } catch (error) {
      console.error('Error deleting all slots by date:', error);
      setMessage(error?.response?.data?.message || 'Error deleting slots.');
      setMessageType('error');
    }
  };

  const handleAddSlot = async () => {
    if (!newSlotTime || !selectedDate) {
      setMessage('Please select a date and enter a time.');
      setMessageType('error');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/slots`,
        {
          date: selectedDate,
          timeSlot: newSlotTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Slot added successfully.');
      setMessageType('success');
      setNewSlotTime('');
      setShowAddSlot(false);
      fetchSlotsByDate(selectedDate);
    } catch (error) {
      console.error('Error adding slot:', error);
      setMessage(error?.response?.data?.message || 'Failed to add slot.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Slot Manager</h1>
              <p className="text-gray-600">Manage available time slots for appointments</p>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🦷</span>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {selectedDate && (
              <button
                onClick={() => setShowAddSlot(!showAddSlot)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Slot
              </button>
            )}
          </div>
        </div>

        {/* Add Slot Form */}
        {showAddSlot && selectedDate && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Time Slot</h3>
              <button
                onClick={() => setShowAddSlot(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot
                </label>
                <input
                  type="time"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddSlot}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

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
              <p className={`text-sm ${
                messageType === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Slots List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedDate ? `Slots for ${new Date(selectedDate).toLocaleDateString()}` : 'Select a date to view slots'}
            </h2>
            {slots.length > 0 && (
              <button
                onClick={handleDeleteAllByDate}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading slots...</p>
              </div>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedDate ? 'No slots found for this date' : 'Select a date to view slots'}
              </h3>
              <p className="text-gray-600">
                {selectedDate ? 'Add some time slots to get started' : 'Choose a date to manage time slots'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot, index) => (
                <div
                  key={slot._id || index}
                  className={`border rounded-lg p-4 ${
                    slot.isBooked 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className={`w-5 h-5 mr-3 ${
                        slot.isBooked ? 'text-red-600' : 'text-green-600'
                      }`} />
                      <div>
                        <p className="font-semibold text-gray-900">{slot.time}</p>
                        <p className={`text-sm ${
                          slot.isBooked ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {slot.isBooked ? 'Booked' : 'Available'}
                        </p>
                      </div>
                    </div>
                    {!slot.isBooked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.time)}
                        className="text-red-600 hover:text-red-800 p-1"
                        disabled={slot.isBooked}
                        title="Individual slot deletion not supported"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
