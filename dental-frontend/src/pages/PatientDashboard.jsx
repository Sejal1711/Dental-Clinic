import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Mail, Phone, FileText, Plus, AlertCircle, History, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientHistory from '../components/PatientHistory';
import UpcomingAppointments from '../components/UpcomingAppointments';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('patientToken');
        const res = await axios.get('http://localhost:5050/api/patients/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatient(res.data);
        
        // Set initial count from patient data if available
        if (res.data?.appointments) {
          setUpcomingCount(res.data.appointments.length);
        }
        
        // Fetch upcoming appointments count
        if (res.data?._id) {
          fetchUpcomingCount(res.data._id, token);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const fetchUpcomingCount = async (patientId, token) => {
    try {
      const response = await axios.get(`http://localhost:5050/api/appointments/upcoming/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUpcomingCount(response.data?.length || 0);
    } catch (err) {
      console.error('Error fetching upcoming count:', err);
      setUpcomingCount(0);
    }
  };

  const handleAppointmentChange = () => {
    // Refresh the upcoming count when appointments change
    if (patient?._id) {
      const token = localStorage.getItem('patientToken');
      fetchUpcomingCount(patient._id, token);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error || 'Failed to load patient data'}</p>
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
                Welcome back, {patient.name}!
              </h1>
              <p className="text-gray-600">Manage your dental appointments and health records</p>
            </div>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🦷</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/book"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-200 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition duration-200">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
                <p className="text-gray-600 text-sm">Schedule a new visit</p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => setShowUpcoming(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-200 group cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition duration-200">
                <CalendarDays className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                <p className="text-gray-600 text-sm">{upcomingCount} scheduled</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-200 group cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition duration-200">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
                <p className="text-gray-600 text-sm">View your treatment history</p>
              </div>
            </div>
          </button>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{patient.phno || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
            <Link
              to="/book"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book New
            </Link>
          </div>

          {patient.appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
              <Link
                to="/book"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.appointments.map((appt) => (
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
                        <h3 className="text-lg font-semibold text-gray-900">
                          {new Date(appt.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <p className="text-gray-600">
                          Time: {appt.timeSlot} | Status: {appt.status || 'Scheduled'}
                        </p>
                        {appt.reason && (
                          <p className="text-gray-500 text-sm mt-1">
                            Reason: {appt.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient History Modal */}
      <PatientHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        patientId={patient?._id}
      />

      {/* Upcoming Appointments Modal */}
      <UpcomingAppointments
        isOpen={showUpcoming}
        onClose={() => setShowUpcoming(false)}
        patientId={patient?._id}
        onAppointmentChange={handleAppointmentChange}
        patientAppointments={patient?.appointments}
      />
    </div>
  );
};

export default PatientDashboard;
