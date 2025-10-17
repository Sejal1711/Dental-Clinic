import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Mail, FileText, AlertCircle, Search, Filter } from 'lucide-react';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('Admin not logged in or token missing.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch appointments');
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(appointment =>
    appointment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Appointments</h1>
              <p className="text-gray-600">Manage and view all patient appointments</p>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🦷</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search appointments by patient name, email, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No appointments found' : 'No appointments yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Appointments will appear here once patients start booking'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.user?.name || 'Unknown Patient'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {appointment.user?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.timeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {appointment.reason || (
                            <span className="text-gray-400 italic">No reason provided</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredAppointments.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredAppointments.length} of {appointments.length} appointments
              </div>
              <div className="text-sm text-gray-600">
                Total appointments: {appointments.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
