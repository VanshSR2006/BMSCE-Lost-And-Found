const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");

/* ============================
   AUTH MIDDLEWARE
============================ */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ============================
   CREATE ITEM + AUTO MATCH ✅
============================ */
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      location,
      date,
      image,
      category,
    } = req.body;

    if (!type || !title || !description || !location || !date || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Create item
    const item = await Item.create({
      type,
      title,
      description,
      location,
      date,
      image: image || null,
      category,
      createdBy: req.user.id,
    });

    console.log("✅ ITEM CREATED:", item.type, item.category);

    /* ============================
       AUTO LOST ↔ FOUND MATCHING
    ============================ */
    if (type === "found") {
      const lostItems = await Item.find({
        type: "lost",
        category,
        createdBy: { $ne: req.user.id },
      });

      console.log("🔍 Matching LOST items:", lostItems.length);

      for (const lost of lostItems) {
        const exists = await Notification.findOne({
          user: lost.createdBy,
          lostItem: lost._id,
          foundItem: item._id,
          status: "pending",
        });

        if (exists) continue;

        await Notification.create({
          user: lost.createdBy,
          lostItem: lost._id,
          foundItem: item._id,
          message: `Possible match found for your lost ${lost.category}`,
        });

        console.log("🔔 Notification sent to user:", lost.createdBy.toString());
      }
    }

    res.status(201).json({ message: "Item posted successfully", item });
  } catch (err) {
    console.error("❌ CREATE ITEM ERROR:", err);
    res.status(500).json({ message: "Failed to create item" });
  }
});

/* ============================
   OTHER ROUTES (UNCHANGED)
============================ */
router.get("/mine", authMiddleware, async (req, res) => {
  const items = await Item.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

router.get("/", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (item.createdBy.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  await item.deleteOne();
  res.json({ message: "Item deleted successfully" });
});

module.exports = router;
