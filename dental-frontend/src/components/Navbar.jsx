
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-primary sticky top-0 z-50 text-background p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Morya Dental Clinic</h1>

        <div className="space-x-4">
          <Link
            to="/"
            className="px-3 py-1 rounded transition duration-200 hover:shadow-lg hover:bg-background hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/book"
            className="px-3 py-1 rounded transition duration-200 hover:shadow-lg hover:bg-background hover:text-primary"
          >
            Book Appointment
          </Link>

          {/* Role-based dashboard */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-3 py-1 rounded transition duration-200 hover:shadow-lg hover:bg-background hover:text-primary"
            >
              Admin Dashboard
            </Link>
          )}

          {user?.role === 'patient' && (
            <Link
              to="/user"
              className="px-3 py-1 rounded transition duration-200 hover:shadow-lg hover:bg-background hover:text-primary"
            >
              User Dashboard
            </Link>
          )}

          {/* Login / Logout button */}
          {!user ? (
            <Link
              to="/login"
              className="px-3 py-1 rounded transition duration-200 hover:shadow-lg hover:bg-background hover:text-primary"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded transition duration-200 hover:shadow-lg hover:bg-background hover:text-primary"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
