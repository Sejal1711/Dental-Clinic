import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  // Sync state with localStorage on route change
  useEffect(() => {
  const storedToken = localStorage.getItem('patientToken') || localStorage.getItem('token');
  const storedType = localStorage.getItem('userType');

  if (storedToken && storedType) {
    setUser(true); // Just a truthy value to show the Logout button
    setUserType(storedType);
  } else {
    setUser(null);
    setUserType(null);
  }
}, [location]);
// triggers every time route changes
const handleLogout = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('patientToken'); // <-- remove this as well
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  return (
    <header className="sticky top-0 z-50 bg-[#0d1b2a] shadow-md">
  <div className="mx-auto flex justify-between items-center px-6 py-4">
    {/* Left Side: Logo */}
    <div className="text-2xl font-bold tracking-wide text-[#e0e1dd]">
      🦷 Morya Dental Clinic
    </div>

    {/* Right Side: Navigation Links */}
    <nav className="flex items-center space-x-4">
      <Link
        to="/"
        className="text-[#e0e1dd] px-4 py-2 rounded-md hover:bg-[#1b263b] transition duration-200"
      >
        Home
      </Link>

      <Link
        to="/book"
        className="text-[#e0e1dd] px-4 py-2 rounded-md hover:bg-[#1b263b] transition duration-200"
      >
        Book Appointment
      </Link>

      {user && userType === 'admin' && (
        <Link
          to="/admin"
          className="text-[#e0e1dd] px-4 py-2 rounded-md hover:bg-[#1b263b] transition duration-200"
        >
          Admin Dashboard
        </Link>
      )}
      

{user && userType === 'patient' && (
  <Link to="/patient/dashboard" className="text-[#e0e1dd] px-4 py-2 rounded-md hover:bg-[#1b263b] transition duration-200">
    My Dashboard
  </Link>
)}

      {!user ? (
        <>
          <Link
            to="/login"
            className="bg-[#415a77] text-white px-4 py-2 rounded-md hover:bg-[#778da9] transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#415a77] text-white px-4 py-2 rounded-md hover:bg-[#778da9] transition duration-200"
          >
            Register
          </Link>
        </>
      ) : (
        <button
          onClick={handleLogout}
          className="bg-[#415a77] text-white px-4 py-2 rounded-md hover:bg-[#778da9] transition duration-200"
        >
          Logout
        </button>
      )}
    </nav>
  </div>
</header>

  );
};

export default Navbar;
