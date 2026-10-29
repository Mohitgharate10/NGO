const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Create event (public)
router.post("/", async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json(event);
});

// Get all events (admin)
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

// Approve / Reject event (admin)
router.patch("/:id", async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.json({ success: true });
});

module.exports = router;
