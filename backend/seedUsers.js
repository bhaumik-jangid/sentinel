const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Post = require("./models/Post");

const MONGO_URI = "mongodb://localhost:27017/"; // change this

const dummyData = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    post: {
      title: "How do you stay motivated for daily exercise?",
      content:
        "I started a morning routine and it really helps! What tips do you have for keeping up healthy habits?",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
    },
  },
  {
    name: "Ben Lee",
    email: "ben@example.com",
    password: "password123",
    post: {
      title: "Share your favorite healthy recipe!",
      content:
        "I love making avocado toast with whole grain bread. Anyone have a go-to smoothie recipe?",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    },
  },
  {
    name: "Priya Singh",
    email: "priya@example.com",
    password: "password123",
    post: {
      title: "What book changed your perspective?",
      content:
        "Recently finished 'Atomic Habits' and it was eye-opening. Would love to hear your recommendations!",
      image:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
    },
  },
  {
    name: "David Kim",
    email: "david@example.com",
    password: "password123",
    post: {
      title: "Tips for balancing work and life?",
      content:
        "How do you manage stress and keep a positive mindset?",
      image:
        "https://plus.unsplash.com/premium_photo-1677160318709-0e97918579df?fm=jpg&q=60&w=3000&auto=format&fit=crop",
    },
  },
];

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    for (const entry of dummyData) {
      let user = await User.findOne({ email: entry.email });

      // Create user only if not exists
      if (!user) {
        const hashedPassword = await bcrypt.hash(entry.password, 10);

        user = await User.create({
          name: entry.name,
          email: entry.email,
          password: hashedPassword,
        });

        console.log(`User created: ${entry.name}`);
      } else {
        console.log(`User already exists: ${entry.name}`);
      }

      // Check if post already exists (avoid duplicates)
      const existingPost = await Post.findOne({
        title: entry.post.title,
        "user.id": user._id.toString(),
      });

      if (!existingPost) {
        await Post.create({
          title: entry.post.title,
          content: entry.post.content,
          image: entry.post.image,
          user: {
            id: user._id.toString(),
            name: user.name,
          },
        });

        console.log(`Post created for ${entry.name}`);
      } else {
        console.log(`Post already exists for ${entry.name}`);
      }
    }

    console.log("Seeding complete ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedData();