const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
const Appointment=require("../models/Appointment");
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

exports.getPatientDashboard= async(req,res)=>{
  try{
    const patient= req.user;
    const appointments= await Appointment.find({user:patient._id}).sort({date:-1});
      res.status(200).json({
        _id: patient._id,
        name:patient.name,
        email:patient.email,
        appointments,
      })

    }catch(error){
      console.error(error);
      res.status(500).json({message:"Failed to fetch dashboard"});
    }
  }

