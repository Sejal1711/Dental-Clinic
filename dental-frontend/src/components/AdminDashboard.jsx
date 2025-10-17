import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Admin token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const res = await axios.get(`http://localhost:5050/api/admin/appointments/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Today\'s appointments response:', res.data);
      setTodaysAppointments(res.data || []);
    } catch (err) {
      console.error('Error fetching today\'s appointments:', err);
      setError(err.response?.data?.message || 'Failed to load today\'s appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => {
            setError('');
            setLoading(true);
            fetchAppointments();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Today's Appointments</h3>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {todaysAppointments.length} appointments
        </span>
      </div>

      {todaysAppointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments today</h3>
          <p className="text-gray-600">All clear! No scheduled appointments for today.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todaysAppointments.map((appt) => (
            <div
              key={appt._id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {appt.name || appt.user?.name || 'Unknown Patient'}
                    </h4>
                    <p className="text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {appt.timeSlot}
                    </p>
                    {appt.reason && (
                      <p className="text-gray-500 text-sm mt-1">
                        <FileText className="w-4 h-4 inline mr-1" />
                        {appt.reason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirmed
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {appt.email || appt.user?.email || 'No email'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
