const express = require('express');
const router = express.Router();
const {
  getPatientHistory,
  addTreatmentNotes,
  getAppointmentDetails
} = require('../controllers/patientHistoryController');
const { protect } = require('../middleware/authMiddleware');

// Get patient medical history
router.get('/history/:patientId', protect, getPatientHistory);

// Add treatment notes to an appointment (admin only)
router.put('/appointment/:appointmentId/notes', protect, addTreatmentNotes);

// Get specific appointment details
router.get('/appointment/:appointmentId', protect, getAppointmentDetails);

module.exports = router;
