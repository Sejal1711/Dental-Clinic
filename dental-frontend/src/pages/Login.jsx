import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Authform.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url = isAdmin
        ? 'http://localhost:5050/api/admin/login'
        : 'http://localhost:5050/api/patients/login';

      const res = await axios.post(url, { email, password });
      const { token } = res.data;

      if (isAdmin) {
        localStorage.setItem('adminToken', token);
      } else {
        localStorage.setItem('patientToken', token);
      }

      localStorage.setItem('userType', isAdmin ? 'admin' : 'patient');
      navigate(isAdmin ? '/admin/home' : '/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              Login as Admin
            </label>
          </div>

          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p className="switch-link hi">
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
