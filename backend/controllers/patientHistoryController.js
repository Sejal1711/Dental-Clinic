const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get patient medical history
const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify patient token
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get all appointments for this patient
    const appointments = await Appointment.find({ user: patientId })
      .populate('user', 'name email')
      .sort({ date: -1, timeSlot: -1 });

    // Transform appointments into medical history format
    const history = appointments.map(appointment => ({
      _id: appointment._id,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      treatment: appointment.reason || 'General consultation',
      doctor: 'Dr. Snehal Tawar', // You can make this dynamic based on your doctor assignment logic
      notes: appointment.notes || 'No additional notes',
      prescription: appointment.prescription || null,
      status: appointment.status || 'completed',
      createdAt: appointment.createdAt
    }));

    res.json(history);
  } catch (error) {
    console.error('Error fetching patient history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add treatment notes to an appointment
const addTreatmentNotes = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { notes, prescription, treatment } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update appointment with treatment details
    appointment.notes = notes;
    appointment.prescription = prescription;
    appointment.treatment = treatment;
    appointment.status = 'completed';

    await appointment.save();

    res.json({ message: 'Treatment notes added successfully', appointment });
  } catch (error) {
    console.error('Error adding treatment notes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get specific appointment details
const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('user', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPatientHistory,
  addTreatmentNotes,
  getAppointmentDetails
};
