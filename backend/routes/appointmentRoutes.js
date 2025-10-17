const express = require("express");
const { 
  bookAppointment, 
  getAllAppointments, 
  getTodaysAppointments,
  getUpcomingAppointments,
  getAllUpcomingAppointments,
  cancelAppointment,
  rescheduleAppointment,
  debugPatientAppointments
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Book a new appointment
router.post("/book", protect, bookAppointment);

// Get all appointments (admin only)
router.get("/all", protect, getAllAppointments);

// Get today's appointments (admin only)
router.get("/today", protect, getTodaysAppointments);

// Get upcoming appointments for all patients (admin only)
router.get("/upcoming", protect, getAllUpcomingAppointments);

// Get upcoming appointments for a specific patient
router.get("/upcoming/:patientId", protect, getUpcomingAppointments);

// Cancel an appointment
router.put("/cancel/:appointmentId", protect, cancelAppointment);

// Reschedule an appointment
router.put("/reschedule/:appointmentId", protect, rescheduleAppointment);

// Debug endpoint
router.get("/debug/:patientId", protect, debugPatientAppointments);

module.exports = router;
