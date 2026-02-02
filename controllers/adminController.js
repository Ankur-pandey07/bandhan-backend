const RelationshipChat = require("../models/RelationshipChat");

/* ================= ADMIN NOTIFICATIONS ================= */
exports.getAdminNotifications = (req, res) => {
  res.json({
    success: true,
    notifications: global.pendingChatRequests || [],
  });
};

/* ================= USER NOTIFICATIONS ================= */
exports.getUserNotifications = (req, res) => {
  const userId = req.userId;

  res.json({
    success: true,
    notifications: global.userNotifications[userId] || [],
  });
};

/* ================= ACCEPT CHAT ================= */
exports.acceptChat = (req, res) => {
  const { id } = req.body;

  const index = global.pendingChatRequests.findIndex(
    (c) => c.id === id
  );

  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const chat = global.pendingChatRequests.splice(index, 1)[0];

  // ✅ ACTIVE CHAT
  global.activeChats.push(chat);

  // 🔔 USER NOTIFICATION
  if (!global.userNotifications[chat.userId]) {
    global.userNotifications[chat.userId] = [];
  }

  global.userNotifications[chat.userId].push({
    text: "Your chat has been accepted by admin",
    createdAt: new Date(),
  });

  res.json({ success: true });
};

/* ================= GET ACTIVE CHATS ================= */
exports.getActiveChats = (req, res) => {
  res.json({
    success: true,
    chats: global.activeChats || [],
  });
};

/* ================= GET ALL CHATS ================= */
exports.getAllChats = async (req, res) => {
  try {
    const chats = await RelationshipChat.find({})
      .sort({ lastActiveAt: -1 })
      .lean();

    res.json({ success: true, chats });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REPLY TO CHAT ================= */
exports.replyToChat = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({
        message: "chatId and text required",
      });
    }

    const chat = await RelationshipChat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "system",
      text,
      createdAt: new Date(),
    });

    chat.lastActiveAt = new Date();
    await chat.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
