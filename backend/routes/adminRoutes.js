const express = require('express');
const { adminProtect } = require('../middleware/adminMiddleware');
const { getAllAppointments } = require('../controllers/appointmentController');
const {
  addSlot,
  getAllSlots,
  deleteSlot
} = require('../controllers/availableSlotController');

const router = express.Router();

// View all appointments (admin only)
router.get('/appointments', adminProtect, getAllAppointments);

// View all slots (admin only)
router.get('/slots', adminProtect, getAllSlots);

// Add a new available slot (admin only)
router.post('/slots', adminProtect, addSlot);

// Delete a slot (admin only)
router.delete('/slots/:id', adminProtect, deleteSlot);

module.exports = router;
