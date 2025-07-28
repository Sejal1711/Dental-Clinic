const AvailableSlot = require("../models/AvailableSlot");

const addSlot = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    const slot = await AvailableSlot.create({ date, timeSlot });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSlots = async (req, res) => {
  try {
    const slots = await AvailableSlot.find();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteSlot = async (req, res) => {
  try {
    const slot = await AvailableSlot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(400).json({ message: "Slot not found" });
    res.json({ message: "Slot removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSlot,
  getAllSlots,
  deleteSlot,
};
