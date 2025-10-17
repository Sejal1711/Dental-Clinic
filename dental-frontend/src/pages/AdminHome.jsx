import React, { useState, useEffect } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { Calendar, Users, Clock, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminHome = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    availableSlots: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      console.log('Admin token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        setError('Admin not authenticated. Please log in as admin.');
        return;
      }

      console.log('Fetching dashboard stats...');

      // First, test if admin authentication is working
      try {
        const testRes = await axios.get('${import.meta.env.VITE_API_URL}/api/admin/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Admin authentication test successful');
      } catch (testError) {
        console.log('Admin authentication test failed:', testError.response?.status, testError.response?.data);
        if (testError.response?.status === 401) {
          setError('Admin authentication failed. Please log in again.');
          return;
        }
      }

      // Try admin endpoints first, fallback to regular endpoints if needed
      let todayAppointmentsRes, allAppointmentsRes, availableSlotsRes;

      try {
        // Try admin endpoints first
        [todayAppointmentsRes, allAppointmentsRes] = await Promise.all([
          axios.get('${import.meta.env.VITE_API_URL}/api/admin/appointments/today', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('${import.meta.env.VITE_API_URL}/api/admin/appointments', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        console.log('Using admin endpoints');
      } catch (adminError) {
        console.log('Admin endpoints failed, trying regular endpoints:', adminError.response?.status);
        // Fallback to regular endpoints
        [todayAppointmentsRes, allAppointmentsRes] = await Promise.all([
          axios.get('${import.meta.env.VITE_API_URL}/api/appointments/today', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('${import.meta.env.VITE_API_URL}/api/appointments/all', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        console.log('Using regular endpoints');
      }

      console.log('Today appointments response:', todayAppointmentsRes.data);
      console.log('All appointments response:', allAppointmentsRes.data);

      // Get today's date for available slots
      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching slots for date:', today);
      
      try {
        // Try admin slots endpoint first
        availableSlotsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/slots?date=${today}&availableOnly=true`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Using admin slots endpoint');
      } catch (slotsError) {
        console.log('Admin slots endpoint failed, trying regular endpoint:', slotsError.response?.status);
        // Fallback to regular slots endpoint
        availableSlotsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/slots?date=${today}&availableOnly=true`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Using regular slots endpoint');
      }

      console.log('Available slots response:', availableSlotsRes.data);

      // Get unique patients from all appointments
      const uniquePatients = new Set();
      allAppointmentsRes.data.forEach(appointment => {
        if (appointment.user && appointment.user._id) {
          uniquePatients.add(appointment.user._id);
        }
      });

      const newStats = {
        todayAppointments: todayAppointmentsRes.data?.length || 0,
        totalPatients: uniquePatients.size,
        availableSlots: availableSlotsRes.data?.availableSlots || 0
      };

      console.log('Setting stats:', newStats);
      setStats(newStats);

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(`Failed to load dashboard statistics: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Admin!
              </h1>
              <p className="text-gray-600">Manage your dental clinic operations and patient appointments</p>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🦷</span>
            </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</h3>
                <p className="text-gray-600 text-sm">Today's Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalPatients}</h3>
                <p className="text-gray-600 text-sm">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.availableSlots}</h3>
                <p className="text-gray-600 text-sm">Available Slots</p>
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Today's Overview</h2>
          </div>
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
