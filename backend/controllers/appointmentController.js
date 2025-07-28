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

module.exports = {
  bookAppointment,
  getAllAppointments,
};
  