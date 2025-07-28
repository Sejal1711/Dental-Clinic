const express = require('express');
const router = express.Router();

const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { getAllAppointments } = require('../controllers/appointmentController');
const {
  addSlot,
  getAllSlots,
  deleteSlot,
} = require('../controllers/availableSlotController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/appointments', adminProtect, getAllAppointments);
router.get('/slots', adminProtect, getAllSlots);
router.post('/slots', adminProtect, addSlot);
router.delete('/slots/:id', adminProtect, deleteSlot);

module.exports = router;
