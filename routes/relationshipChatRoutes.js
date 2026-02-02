const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  userEnteredChat,
} = require("../controllers/relationshipChatController");

router.post("/enter", authMiddleware, userEnteredChat);

module.exports = router;
