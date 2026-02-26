# Sentinel — Moderated Social Media Platform

A full-stack social media platform with moderated content, Q&A, image sharing, and community features.

---

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally)
- npm (comes with Node.js)

---

## Project Structure

```
sentinel/
├── backend/        ← Express + MongoDB API
│   ├── .env        ← you already have this
│   └── seedData.js ← dummy data script
└── frontend/       ← Next.js application
    └── .env        ← you already have this
```

---

## Step 1 — Start MongoDB

Make sure your local MongoDB is running before starting the app.

```bash
# On macOS/Linux
mongod

# On Windows (run as Administrator)
net start MongoDB
```

---

## Step 2 — Setup & Run Backend

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Run the backend server
npm run dev
```

Backend will start at: **http://localhost:5000**

---

## Step 3 — Setup & Run Frontend

Open a **new terminal** and run:

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Run the frontend dev server
npm run dev
```

Frontend will start at: **http://localhost:3000**

---

## Step 4 — Seed Dummy Data (Optional)

If you want to populate the database with sample posts and users, run the seed script from the **backend** folder.

> ⚠️ Make sure the backend server is **stopped** before running the seed, or run it in a separate terminal.

```bash
# Make sure you're in the backend folder
cd backend

# Run the seed script
node seedData.js
```

This will insert dummy users, posts, and sample data into your local MongoDB database.

---

## Step 5 — Open the App

Once both servers are running, open your browser and go to:

```
http://localhost:3000
```
---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Theme | next-themes (light/dark mode) |

---

*College project — Sentinel Social Media Platform*