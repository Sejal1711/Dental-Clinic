const mongoose = require("mongoose");

const availableSlotSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  slots: { type: [String], required: true }  // <-- array of time slots
}, {
  timestamps: true
});

const AvailableSlot = mongoose.model("AvailableSlot", availableSlotSchema);
module.exports = AvailableSlot;
