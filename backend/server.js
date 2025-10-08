const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');


dotenv.config();

const cron = require('node-cron'); // ✅ Add cron here
const { generateSlotsForWeekInternal } = require('./controllers/availableSlotController'); // ✅ Import internal function

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/authRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes'); 
const slotRoutes = require('./routes/slotRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB Connected');

  // ✅ Run immediately on server start
  await generateSlotsForWeekInternal();

  // ✅ Schedule cron job for midnight every day
  cron.schedule('0 0 * * *', generateSlotsForWeekInternal);
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/admin', adminRoutes); 
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes); 
app.use('/api/slots', slotRoutes);

app.get('/', (req, res) => {
  res.send('Dental Clinic API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
