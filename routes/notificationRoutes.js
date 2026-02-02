const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserNotifications,
  addDemoNotification,
} = require("../controllers/notificationController");

// 🔐 USER ONLY
router.use(authMiddleware);

// 📄 Get notifications
router.get("/", getUserNotifications);

// ➕ Add demo notification (testing only)
router.post("/demo", addDemoNotification);

module.exports = router;
