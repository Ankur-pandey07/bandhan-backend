const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getAllChats,
  replyToChat,
  getAdminNotifications,
  acceptChat,
  getActiveChats,
} = require("../controllers/adminController");

// 🔐 ADMIN ONLY
router.use(authMiddleware, requireAdmin);

// 🔔 Admin notifications
router.get("/notifications", getAdminNotifications);

// ✅ Accept chat
router.post("/accept-chat", acceptChat);

// 📂 Active chats
router.get("/active-chats", getActiveChats);

// 💬 All chats
router.get("/chats", getAllChats);

// ✍️ Reply
router.post("/chat/reply", replyToChat);

module.exports = router;
