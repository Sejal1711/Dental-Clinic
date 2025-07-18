const Appointment = require("../models/Appointment");
const AvailableSlot = require("../models/AvailableSlot");

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { date, timeSlot, reason } = req.body;
    const patientId = req.user.id;

    // Check if slot exists in AvailableSlot
    const slot = await AvailableSlot.findOne({ date, timeSlot });
    if (!slot) {
      return res.status(400).json({ message: "Selected slot is not available" });
    }

    // Book the appointment
    const appointment = await Appointment.create({
      patient: patientId,
      date,
      timeSlot,
      reason,
    });

    // Remove the slot from available slots
    await AvailableSlot.findByIdAndDelete(slot._id);

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patient', 'name email');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
};
