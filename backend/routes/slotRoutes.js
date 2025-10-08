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
router.delete("/day", protect, deleteSlotsByDate);   
router.delete("/:id", protect, deleteSlot);       
router.post('/generate-week', protect, generateSlotsForWeek);


module.exports = router;
