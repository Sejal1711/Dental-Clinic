const AvailableSlot = require('../models/AvailableSlot');


const getAllSlots = async (req, res) => {
  try {
    const { date, availableOnly } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Please provide a date in query' });
    }

    let query = { date };

    if (availableOnly === 'true') {
      query.isBooked = false; // Only free slots
    }

    const slots = await AvailableSlot.find(query);

    if (!slots || slots.length === 0) {
      return res.status(404).json({ message: 'No slots found for the selected criteria' });
    }

    res.status(200).json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ message: 'Server error while fetching slots' });
  }
};


// Delete a single slot by ID
const deleteSlot = async (req, res) => {
  try {
    const slot = await AvailableSlot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete slot' });
  }
};


const deleteSlotsByDate = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const result = await AvailableSlot.deleteMany({ date });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No slots found for this date' });
    }
    res.status(200).json({ message: 'All slots on selected date deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete slots by date' });
  }
};


const generateDefaultSlots = () => {
  const startHour = 10;
  const startMinute = 30;
  const endHour = 22;

  const allSlots = [];
  const now = new Date();

  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const yyyyMMdd = date.toISOString().split('T')[0];

    let hour = startHour;
    let minute = startMinute;

    while (hour < endHour) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      allSlots.push({ date: yyyyMMdd, timeSlot: time });
      hour += 1;
    }
  }

  return allSlots;
};

const generateSlotsForWeek = async (req, res) => {
  try {
    const slots = generateDefaultSlots();
    await AvailableSlot.insertMany(slots);
    res.status(201).json({ message: 'Slots generated for the next 7 days', slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating slots' });
  }
};

module.exports = {
  getAllSlots,
  deleteSlot,
  deleteSlotsByDate,
  generateSlotsForWeek,
};
