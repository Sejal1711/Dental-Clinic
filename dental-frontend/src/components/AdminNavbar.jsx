
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, LogOut, User } from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-900 text-xl font-bold">🦷</span>
              </div>
              <span className="text-white text-xl font-bold tracking-wide">
                Morya Dental - Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Link
              to="/admin/home"
              className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>

            <Link
              to="/admin/appointments"
              className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </Link>

            <Link
              to="/admin/slots"
              className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <Clock className="w-4 h-4 mr-2" />
              Manage Slots
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
