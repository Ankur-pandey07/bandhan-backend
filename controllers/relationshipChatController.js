exports.userEnteredChat = (req, res) => {
  const userId = req.userId || "guest-user";

  // 🔔 Admin notification
  global.pendingChatRequests.push({
    id: Date.now().toString(),
    userId,
    section: "Relationship Chat",
    createdAt: new Date(),
  });

  res.json({ success: true });
};
