const express= require("express");
const{addSlot, getAllSlots, deleteSlot}= require("../controllers/availableSlotController");
const {protect}= require("../middleware/authMiddleware");

const router= express.Router();

router.get("/", protect, getAllSlots);
router.post("/", protect, addSlot);
router.delete("/:id", protect, deleteSlot);

module.exports= router;