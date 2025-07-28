const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      adminId: newAdmin._id,
      token: generateToken(newAdmin._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    adminId: admin._id,
    token: generateToken(admin._id),
  });
};

module.exports = { registerAdmin, loginAdmin };
