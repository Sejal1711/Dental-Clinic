const express = require('express');
const router = express.Router();
const {
  getPatientHistory,
  addTreatmentNotes,
  getAppointmentDetails
} = require('../controllers/patientHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Get patient medical history
router.get('/history/:patientId', authMiddleware, getPatientHistory);

// Add treatment notes to an appointment (admin only)
router.put('/appointment/:appointmentId/notes', authMiddleware, addTreatmentNotes);

// Get specific appointment details
router.get('/appointment/:appointmentId', authMiddleware, getAppointmentDetails);

module.exports = router;
