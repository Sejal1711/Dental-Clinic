const express = require('express');
const {
  registerPatient,
  loginPatient,
} = require('../controllers/authController');
const { getPatientDashboard } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.get('/dashboard',protect,getPatientDashboard); // Assuming you have a function to get patient dashboard data
module.exports = router;
