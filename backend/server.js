const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* =========================
   ✅ FORCE CORS (RENDER + VERCEL)
   ========================= */
app.use((req, res, next) => {
  // Debug log so we can see in Render logs that this runs
  console.log("CORS middleware:", req.method, req.path);

  res.header(
    "Access-Control-Allow-Origin",
    "https://bmsce-lost-and-found.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

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
