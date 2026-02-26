const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name:   { type: String, required: true },
    text:   { type: String, required: true },
  },
  { timestamps: true } // ✅ gives createdAt on each comment
);

const postSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true },
    content: { type: String, required: true },
    image:   { type: String, default: "" },
    user: {
      id:   String,
      name: String,
    },
    likes:    [{ type: String }],
    comments: [commentSchema], // ✅ sub-document — .id() and .pull() work correctly
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);