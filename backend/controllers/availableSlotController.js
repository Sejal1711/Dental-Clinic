const AvailableSlot = require('../models/AvailableSlot');
const Appointment = require('../models/Appointment');

/**
 * Generate slots for a single day
 */
const generateSlotsForDate = () => {
  const startHour = 10;
  const startMinute = 30;
  const endHour = 22;

  const slots = [];
  let hour = startHour;
  let minute = startMinute;

  while (hour < endHour) {
    const time = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
    slots.push(time); // ✅ store as plain strings
    hour += 1;
  }

  return slots;
};

/**
 * Internal function for cron job or immediate run
 * Runs without needing a request/response
 */
const generateSlotsForWeekInternal = async () => {
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const yyyyMMdd = date.toISOString().split('T')[0];

    const exists = await AvailableSlot.findOne({ date: yyyyMMdd });
    if (!exists) {
      await AvailableSlot.create({
        date: yyyyMMdd,
        slots: generateSlotsForDate(), // ✅ just strings
      });
      console.log(`✅ Created slots for ${yyyyMMdd}`);
    } else {
      console.log(`📅 Slots already exist for ${yyyyMMdd}`);
    }
  }
};

/**
 * API endpoint version for manual trigger
 */
const generateSlotsForWeek = async (req, res) => {
  try {
    await generateSlotsForWeekInternal();
    res.status(201).json({ message: 'Slots generated for the next 7 days' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating slots' });
  }
};

const getAllSlots = async (req, res) => {
  try {
    const { date, availableOnly } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ message: "Please provide a date in query" });
    }

    const slotsDoc = await AvailableSlot.findOne({ date });
    if (!slotsDoc) {
      return res.status(404).json({ message: "No slots found for this date" });
    }

    // Fetch appointments for that date
    const appointments = await Appointment.find({ date });
    const bookedTimes = appointments.map((a) => a.timeSlot);

    // Decorate slots with booking status
    let slots = slotsDoc.slots.map((time) => ({
      time,
      isBooked: bookedTimes.includes(time),
    }));

    // If availableOnly=true → filter
    if (availableOnly === "true") {
      slots = slots.filter((s) => !s.isBooked);
    }

    return res.status(200).json({
      date: slotsDoc.date,
      totalSlots: slotsDoc.slots.length,
      availableSlots: slots.filter((s) => !s.isBooked).length,
      slots,
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching slots" });
  }
};

/**
 * Delete a single slot document by ID
 */
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

/**
 * Delete all slots by date
 */
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

module.exports = {
  getAllSlots,
  deleteSlot,
  deleteSlotsByDate,
  generateSlotsForWeek,
  generateSlotsForWeekInternal,
};
