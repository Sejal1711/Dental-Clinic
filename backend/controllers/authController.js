const Patient = require("../models/Patient");
const generateToken = require("../utils/generatetokens");

// Register Patient
const registerPatient = async (req, res) => {
  try {
    const { name, email, phno, password } = req.body;

    const patientExists = await Patient.findOne({ email });
    if (patientExists)
      return res.status(400).json({ message: "Patient already exists" });

    const patient = await Patient.create({ name, email, password, phno });

    res.status(201).json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      token: generateToken(patient._id, 'patient'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Patient
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (patient && await patient.matchPassword(password)) {
      res.json({
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        token: generateToken(patient._id, 'patient'),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all
module.exports = {
  registerPatient,
  loginPatient,
};
