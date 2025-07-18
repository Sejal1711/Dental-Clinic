const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patients = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phno: { type: String },
    isAdmin: { type: Boolean, default: false }, // ✅ Add this line
  },
  {
    timestamps: true,
  }
);

// Hash password before save
patients.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password
patients.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Patient = mongoose.model("Patient", patients);
module.exports = Patient;
