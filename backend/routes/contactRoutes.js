const express = require("express");
const Contact = require("../models/Contact");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/contact/mine — must be before /:id
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find({
      email: { $regex: new RegExp(`^${req.user.email}$`, "i") },
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/contact — name & email from JWT, not form
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message)
      return res.status(400).json({ message: "Message is required" });

    await Contact.create({
      name: req.user.name,               // ✅ from token
      email: req.user.email.toLowerCase().trim(), // ✅ from token, normalized
      message,
    });

    res.status(201).json({ message: "Message received! We'll get back to you soon." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;