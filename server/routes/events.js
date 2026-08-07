const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController.js");

const { protect, admin } = require("../middleware/auth.js");

// Import Multer
const upload = require("../middleware/upload.js");

// Public Routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin Routes
router.post("/", protect, admin, upload.single("image"), createEvent);

router.put("/:id", protect, admin, upload.single("image"), updateEvent);

router.delete("/:id", protect, admin, deleteEvent);

module.exports = router;
