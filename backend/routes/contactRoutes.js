const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

/* POST contact */
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ message: "Contact message sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET contacts (admin) */
router.get("/", async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

module.exports = router;
