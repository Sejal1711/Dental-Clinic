const express = require('express');
const router = express.Router();

const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { getAllAppointments ,getTodaysAppointments} = require('../controllers/appointmentController');
const {
  
  getAllSlots,
  deleteSlot,
  deleteSlotsByDate
} = require('../controllers/availableSlotController');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/appointments', adminProtect, getAllAppointments);
router.get('/slots', adminProtect, getAllSlots);
router.get('/appointments/today', adminProtect, getTodaysAppointments);
// router.post('/slots', adminProtect, addSlot);
router.delete('/slots/:id', adminProtect, deleteSlot);
router.delete('/slots/day', adminProtect, deleteSlotsByDate);
module.exports = router;
