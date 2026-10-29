const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");

// Create volunteer request (public)
router.post("/", async (req, res) => {
  const volunteer = new Volunteer(req.body);
  await volunteer.save();
  res.json({ message: "Volunteer appointment booked successfully!" });
});

// Get all volunteers (admin)
router.get("/", async (req, res) => {
  const volunteers = await Volunteer.find().sort({ createdAt: -1 });
  res.json(volunteers);
});

// Approve / Reject volunteer (admin)
router.patch("/:id", async (req, res) => {
  await Volunteer.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.json({ success: true });
});

module.exports = router;
