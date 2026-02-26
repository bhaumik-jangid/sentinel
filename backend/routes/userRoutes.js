const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post"); // ⚠️ You were missing this import!

const router = express.Router();

// GET ALL USERS (TEST PURPOSE ONLY)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ count: users.length, users });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Specific route BEFORE dynamic /:id route
// GET POSTS BY USER
router.get("/:id/posts", async (req, res) => {
  try {
    const posts = await Post.find({
      "user.id": req.params.id,
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("USER POSTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE USER — keep dynamic route LAST
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;