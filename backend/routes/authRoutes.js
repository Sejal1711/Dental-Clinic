const express = require('express');
const {
  registerPatient,
  loginPatient
} = require('../controllers/authController');

const router = express.Router();

router.post('/patients/register', registerPatient);
router.post('/patients/login', loginPatient);

module.exports = router;
