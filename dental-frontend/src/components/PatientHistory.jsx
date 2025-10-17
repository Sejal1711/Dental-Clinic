import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, FileText, AlertCircle, CheckCircle, X, Download, Eye } from 'lucide-react';

const PatientHistory = ({ isOpen, onClose, patientId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientHistory();
    }
  }, [isOpen, patientId]);

  const fetchPatientHistory = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('patientToken');
      const response = await axios.get(`http://localhost:5050/api/history/history/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setHistory(response.data || []);
    } catch (err) {
      console.error('Error fetching patient history:', err);
      setError(err.response?.data?.message || 'Failed to load patient history');
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Medical History</h2>
              <p className="text-blue-100">Your complete dental treatment history</p>
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
                <p className="text-gray-600">Loading your medical history...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchPatientHistory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Retry
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical History</h3>
              <p className="text-gray-600">Your medical history will appear here after your first appointment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((record, index) => (
                <div
                  key={record._id || index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formatDate(record.date)}
                        </h3>
                        <p className="text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(record.timeSlot)}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Treatment Details</h4>
                      <p className="text-gray-600">{record.treatment || record.reason || 'General consultation'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Doctor</h4>
                      <p className="text-gray-600">{record.doctor || 'Dr. Snehal Tawar'}</p>
                    </div>
                  </div>

                  {record.notes && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{record.notes}</p>
                    </div>
                  )}

                  {record.prescription && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Prescription</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-700">{record.prescription}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <button className="text-blue-600 hover:text-blue-700 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Download Report
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Record ID: {record._id?.slice(-8) || 'N/A'}
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
              Total Records: {history.length}
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
    </div>
  );
};

export default PatientHistory;
