const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const Post = require("../models/Post");

const router = express.Router();
const { isToxic } = require("../utils/moderation");
const axios = require("axios");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, image, forceClean } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const [cleanTitleRes, cleanContentRes] = await Promise.all([
      axios.get("https://www.purgomalum.com/service/json", {
        params: { text: title }
      }),
      axios.get("https://www.purgomalum.com/service/json", {
        params: { text: content }
      })
    ]);

    const cleanedTitle = cleanTitleRes.data.result;
    const cleanedContent = cleanContentRes.data.result;

    const isCleaned =
      cleanedTitle !== title || cleanedContent !== content;

    // 🚨 If vulgar and user has NOT confirmed
    if (isCleaned && !forceClean) {
      return res.status(200).json({
        cleaned: true,
        post: {
          title: cleanedTitle,
          content: cleanedContent,
          image
        }
      });
    }

    // ✅ Save post only if clean OR user confirmed
    const post = await Post.create({
      title: isCleaned ? cleanedTitle : title,
      content: isCleaned ? cleanedContent : content,
      image,
      user: {
        id: req.user.id,
        name: req.user.name
      }
    });

    res.status(201).json({
      cleaned: false,
      post
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET ALL POSTS */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    // console.log("Fetched posts:", posts); // 🔥 add this
    res.json(posts);
  } catch (error) {
    console.error("GET POSTS ERROR:", error); // 🔥 add this
    res.status(500).json({ message: "Server error" });
  }
});


// ❤️ LIKE / UNLIKE POST
router.put("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD COMMENT
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      userId: req.user.id,
      name: req.user.name,
      text,
    });

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE COMMENT
// ✅ User can delete their own comment OR post owner can delete any comment
router.delete("/:id/comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isCommentOwner = comment.userId === req.user.id;
    const isPostOwner = post.user.id === req.user.id;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    res.json(post); // return updated post so frontend can refresh
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE POST
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Post not found" });

    // Ownership check
    if (post.user.id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let cleanedTitle = title ?? post.title;
    let cleanedContent = content ?? post.content;

    // Clean only if fields provided
    if (title) {
      const cleanRes = await axios.get(
        "https://www.purgomalum.com/service/json",
        { params: { text: title } }
      );
      cleanedTitle = cleanRes.data.result;
    }

    if (content) {
      const cleanRes = await axios.get(
        "https://www.purgomalum.com/service/json",
        { params: { text: content } }
      );
      cleanedContent = cleanRes.data.result;
    }

    post.title = cleanedTitle;
    post.content = cleanedContent;
    if (image !== undefined) post.image = image;

    await post.save();

    res.json({
      message: "Post updated successfully",
      cleaned:
        (title && cleanedTitle !== title) ||
        (content && cleanedContent !== content),
      post,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: "Post not found" });

    // Ownership check
    if (post.user.id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;