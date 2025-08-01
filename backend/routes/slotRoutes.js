const express = require("express");
const {
  generateSlotsForWeek,
  getAllSlots,
  deleteSlot,
  deleteSlotsByDate,
} = require("../controllers/availableSlotController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAllSlots);
// router.post("/", protect, generateDefaultSlots);
router.delete("/day", protect, deleteSlotsByDate);   // Delete all slots on a day (by date query param)
router.delete("/:id", protect, deleteSlot);          // Delete a specific slot by ID
router.post('/generate-week', protect, generateSlotsForWeek);


module.exports = router;
