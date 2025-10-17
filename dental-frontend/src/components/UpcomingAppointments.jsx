import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, AlertCircle, X, Edit, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

const UpcomingAppointments = ({ isOpen, onClose, patientId, onAppointmentChange, patientAppointments }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchUpcomingAppointments();
    } else if (isOpen && patientAppointments) {
      // Fallback to show appointments from patient data
      console.log('Using fallback appointments:', patientAppointments);
      setAppointments(patientAppointments || []);
    }
  }, [isOpen, patientId, patientAppointments]);

  const fetchUpcomingAppointments = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('patientToken');
      console.log('Fetching upcoming appointments for patient:', patientId);
      console.log('Using token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(`http://localhost:5050/api/appointments/upcoming/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Upcoming appointments response:', response.data);
      setAppointments(response.data || []);
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to load upcoming appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    if (!date) return;
    
    setSlotLoading(true);
    try {
      const response = await axios.get(`http://localhost:5050/api/slots/available?date=${date}`);
      setAvailableSlots(response.data || []);
    } catch (err) {
      console.error('Error fetching available slots:', err);
    } finally {
      setSlotLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const token = localStorage.getItem('patientToken');
      await axios.put(
        `http://localhost:5050/api/appointments/cancel/${selectedAppointment._id}`,
        { reason: cancelReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowCancelModal(false);
      setCancelReason('');
      setSelectedAppointment(null);
      fetchUpcomingAppointments(); // Refresh the list
      onAppointmentChange && onAppointmentChange(); // Notify parent to refresh count
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !newDate || !newTimeSlot) return;

    try {
      const token = localStorage.getItem('patientToken');
      await axios.put(
        `http://localhost:5050/api/appointments/reschedule/${selectedAppointment._id}`,
        { newDate, newTimeSlot },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowRescheduleModal(false);
      setNewDate('');
      setNewTimeSlot('');
      setSelectedAppointment(null);
      fetchUpcomingAppointments(); // Refresh the list
      onAppointmentChange && onAppointmentChange(); // Notify parent to refresh count
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      setError(err.response?.data?.message || 'Failed to reschedule appointment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
              <p className="text-blue-100">Manage your scheduled appointments</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-600 p-2 rounded-lg transition duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your appointments...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchUpcomingAppointments}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Retry
              </button>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('patientToken');
                    const response = await axios.get(`http://localhost:5050/api/appointments/debug/${patientId}`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log('Debug response:', response.data);
                    alert(`Debug: Found ${response.data.totalAppointments} appointments`);
                  } catch (err) {
                    console.error('Debug error:', err);
                    alert('Debug failed: ' + err.message);
                  }
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200 ml-2"
              >
                Debug
              </button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Appointments</h3>
              <p className="text-gray-600">You don't have any scheduled appointments at the moment.</p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  Debug Info: Patient ID: {patientId}, Appointments: {appointments.length}
                </p>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('patientToken');
                      const response = await axios.get(`http://localhost:5050/api/appointments/debug/${patientId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      console.log('Debug response:', response.data);
                      alert(`Debug: Found ${response.data.totalAppointments} appointments`);
                    } catch (err) {
                      console.error('Debug error:', err);
                      alert('Debug failed: ' + err.message);
                    }
                  }}
                  className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  Debug All Appointments
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <div
                  key={appointment._id || index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formatDate(appointment.date)}
                        </h3>
                        <p className="text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(appointment.timeSlot)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status || 'scheduled')}`}>
                        {getStatusIcon(appointment.status || 'scheduled')}
                        <span className="ml-1 capitalize">{appointment.status || 'scheduled'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Doctor</h4>
                      <p className="text-gray-600">{appointment.doctor || 'Dr. Snehal Tawar'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Reason</h4>
                      <p className="text-gray-600">{appointment.reason || 'General consultation'}</p>
                    </div>
                  </div>

                  {appointment.cancellationReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-700">
                          <strong>Cancellation Reason:</strong> {appointment.cancellationReason}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {(appointment.status === 'scheduled' || !appointment.status) && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowRescheduleModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Reschedule
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowCancelModal(true);
                            }}
                            className="text-red-600 hover:text-red-700 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      ID: {appointment._id?.slice(-8) || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total Upcoming: {appointments.length}
            </p>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Appointment</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Please provide a reason for cancellation..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setSelectedAppointment(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    fetchAvailableSlots(e.target.value);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Time Slot
                </label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  disabled={!newDate || slotLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {!newDate ? 'Select a date first' : slotLoading ? 'Loading slots...' : 'Select time slot'}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatTime(slot)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setNewDate('');
                  setNewTimeSlot('');
                  setSelectedAppointment(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleAppointment}
                disabled={!newDate || !newTimeSlot}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;
