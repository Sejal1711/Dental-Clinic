const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env variables from .env file
dotenv.config();

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/authRoutes'); // if you have
const appointmentRoutes = require('./routes/appointmentRoutes'); // if separate
const slotRoutes = require('./routes/slotRoutes'); // if separate

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

app.use('/api/admin', adminRoutes); 
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes); 
app.use('/api/slots', slotRoutes);

app.get('/', (req, res) => {
  res.send('Dental Clinic API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
