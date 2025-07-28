const express = require('express');
const {
  registerPatient,
  loginPatient,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', loginPatient);

module.exports = router;
