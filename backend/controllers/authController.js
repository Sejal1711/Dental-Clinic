const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.registerPatient = async (req, res) => {
  const { name, email, password, phno } = req.body;

  try {
    const userExists = await Patient.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const user = await Patient.create({ name, email, password, phno });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Patient.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

