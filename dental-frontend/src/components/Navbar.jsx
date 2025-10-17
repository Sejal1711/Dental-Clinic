import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Calendar, Home, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync state with localStorage on route change
  useEffect(() => {
    const storedToken = localStorage.getItem('patientToken') || localStorage.getItem('token');
    const storedType = localStorage.getItem('userType');

    if (storedToken && storedType) {
      setUser(true);
      setUserType(storedType);
    } else {
      setUser(null);
      setUserType(null);
    }
  }, [location]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('patientToken');
      localStorage.removeItem('userType');
      setUser(null);
      setUserType(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-700 text-xl font-bold">🦷</span>
              </div>
              <span className="text-white text-xl font-bold tracking-wide">
                Morya Dental Clinic
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-white hover:bg-slate-600 px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>

            <Link
              to="/book"
              className="text-white hover:bg-slate-600 px-4 py-2 rounded-lg transition duration-200 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Link>

            {user && userType === 'admin' && (
              <Link
                to="/admin/home"
                className="text-white hover:bg-slate-600 px-4 py-2 rounded-lg transition duration-200 flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Link>
            )}

            {user && userType === 'patient' && (
              <Link
                to="/patient/dashboard"
                className="text-white hover:bg-slate-600 px-4 py-2 rounded-lg transition duration-200 flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                My Dashboard
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:bg-blue-700 p-2 rounded-lg transition duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-700 rounded-lg mt-2">
              <Link
                to="/"
                className="text-white hover:bg-slate-600 block px-3 py-2 rounded-lg transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/book"
                className="text-white hover:bg-slate-600 block px-3 py-2 rounded-lg transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Appointment
              </Link>
              {user && userType === 'admin' && (
                <Link
                  to="/admin/home"
                  className="text-white hover:bg-slate-600 block px-3 py-2 rounded-lg transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {user && userType === 'patient' && (
                <Link
                  to="/patient/dashboard"
                  className="text-white hover:bg-slate-600 block px-3 py-2 rounded-lg transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
              )}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-500 text-white block px-3 py-2 rounded-lg transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-700 hover:bg-gray-100 block px-3 py-2 rounded-lg transition duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white block w-full text-left px-3 py-2 rounded-lg transition duration-200"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
