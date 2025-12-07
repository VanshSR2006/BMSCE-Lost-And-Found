const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

/* =====================
   ROUTES
===================== */
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/admin");
/* =====================
   APP INIT (⚠️ MUST COME FIRST)
===================== */
const app = express();

/* =====================
   MIDDLEWARE
===================== */
const cors = require("cors");

const corsOptions = {
  origin: "https://bmsce-lost-and-found.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ VERY IMPORTANT


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =====================
   ROUTES REGISTRATION
===================== */
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);
/* =====================
   DB + SERVER START
===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
