const Appointment = require("../models/Appointment");

const bookAppointment = async (req, res) => {
  const { date, timeSlot, reason } = req.body;

  if (!date || !timeSlot) {
    return res.status(400).json({ message: "Date and TimeSlot are required" });
  }

  try {
    const existing = await Appointment.findOne({ date, timeSlot });
    if (existing) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const newAppointment = await Appointment.create({
      user: req.user._id,
      date,
      timeSlot,
      reason,
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: "Server error while booking appointment" });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
};


const getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; 

    const appointments = await Appointment.find({ date: today });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today's appointments', error });
  }
};

// Get upcoming appointments for a specific patient
const getUpcomingAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify patient exists
    const Patient = require('../models/Patient');
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    console.log('Upcoming appointments query:', {
      patientId,
      today,
      currentTime
    });

    // First, let's get ALL appointments for this patient to debug
    const allAppointments = await Appointment.find({ user: patientId });
    console.log('All appointments for patient:', allAppointments);

    // Get upcoming appointments (simplified query for now)
    const appointments = await Appointment.find({
      user: patientId,
      date: { $gte: today }, // Today and future dates
      status: { $in: ['scheduled', 'confirmed'] } // Only active appointments
    })
    .populate('user', 'name email phone')
    .sort({ date: 1, timeSlot: 1 }); // Sort by date and time

    console.log('Upcoming appointments found:', appointments);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get upcoming appointments for admin (all patients)
const getAllUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // Get upcoming appointments for all patients
    const appointments = await Appointment.find({
      $or: [
        { date: { $gt: today } }, // Future dates
        { 
          date: today,
          timeSlot: { $gte: currentTime } // Today's appointments that haven't passed
        }
      ],
      status: { $in: ['scheduled', 'confirmed'] } // Only active appointments
    })
    .populate('user', 'name email phone')
    .sort({ date: 1, timeSlot: 1 }); // Sort by date and time

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching all upcoming appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if appointment is in the future
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    
    if (appointment.date < today || (appointment.date === today && appointment.timeSlot < currentTime)) {
      return res.status(400).json({ message: 'Cannot cancel past appointments' });
    }

    appointment.status = 'cancelled';
    if (reason) {
      appointment.cancellationReason = reason;
    }
    appointment.updatedAt = new Date();

    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { newDate, newTimeSlot } = req.body;

    if (!newDate || !newTimeSlot) {
      return res.status(400).json({ message: 'New date and time slot are required' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if new slot is available
    const existing = await Appointment.findOne({ 
      date: newDate, 
      timeSlot: newTimeSlot,
      _id: { $ne: appointmentId } // Exclude current appointment
    });
    
    if (existing) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Update appointment
    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = 'scheduled';
    appointment.updatedAt = new Date();

    await appointment.save();

    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Debug endpoint to get all appointments for a patient
const debugPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Get ALL appointments for this patient (no filtering)
    const allAppointments = await Appointment.find({ user: patientId })
      .populate('user', 'name email phone')
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      patientId,
      totalAppointments: allAppointments.length,
      appointments: allAppointments
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  bookAppointment,
  getAllAppointments,
  getTodaysAppointments,
  getUpcomingAppointments,
  getAllUpcomingAppointments,
  cancelAppointment,
  rescheduleAppointment,
  debugPatientAppointments
};
  