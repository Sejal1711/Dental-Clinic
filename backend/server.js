const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Default health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const slotRoutes = require('./routes/slotRoutes');
const adminRoutes = require('./routes/adminRoutes'); // include this if you made it

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/slots', slotRoutes); // <- ✅ You missed this line before
app.use('/api/admin', adminRoutes); // <- Optional: admin-only routes

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
