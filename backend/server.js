const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* =========================
   ✅ FORCE CORS (RENDER + VERCEL)
   ========================= */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // ✅ allow all vercel preview + prod domains
  if (
    origin &&
    (origin.endsWith(".vercel.app") ||
     origin === "http://localhost:5173")
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =====================
   BODY PARSERS
   ===================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =====================
   ROUTES
   ===================== */
app.use("/auth", require("./routes/auth"));
app.use("/items", require("./routes/items"));
app.use("/notifications", require("./routes/notifications"));
app.use("/admin", require("./routes/admin"));

/* =====================
   DB + SERVER
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
