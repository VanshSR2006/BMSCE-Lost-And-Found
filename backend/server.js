const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ✅ CORS — MUST COME BEFORE ROUTES */
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://bmsce-lost-and-found.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ✅ BODY PARSERS */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ✅ ROUTES */
app.use("/auth", require("./routes/auth"));
app.use("/items", require("./routes/items"));
app.use("/notifications", require("./routes/notifications"));
app.use("/admin", require("./routes/admin"));

/* ✅ START SERVER AFTER DB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });
