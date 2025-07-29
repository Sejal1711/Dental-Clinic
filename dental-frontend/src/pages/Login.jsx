import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient"); // 'patient' or 'admin'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        userType === "admin"
          ? "http://localhost:5050/api/admin/login"
          : "http://localhost:5050/api/patients/login";

      const response = await axios.post(endpoint, { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", userType);

        if (userType === "admin") {
          navigate("/admin/home");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div>
          <label>
            <input
              type="radio"
              value="patient"
              checked={userType === "patient"}
              onChange={() => setUserType("patient")}
            />
            Patient
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              value="admin"
              checked={userType === "admin"}
              onChange={() => setUserType("admin")}
            />
            Admin
          </label>
        </div>

        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </form>
    </div>
  );
};

export default Login;
