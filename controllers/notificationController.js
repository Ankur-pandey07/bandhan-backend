// 📄 GET USER NOTIFICATIONS
exports.getUserNotifications = (req, res) => {
  const userId = req.userId;

  if (!global.userNotifications[userId]) {
    global.userNotifications[userId] = [];
  }

  res.json({
    success: true,
    notifications: global.userNotifications[userId],
  });
};

// ➕ ADD DEMO NOTIFICATION (testing)
exports.addDemoNotification = (req, res) => {
  const userId = req.userId;

  if (!global.userNotifications[userId]) {
    global.userNotifications[userId] = [];
  }

  global.userNotifications[userId].push({
    id: Date.now().toString(),
    text: "❤️ Someone liked your profile",
    createdAt: new Date(),
  });

  res.json({ success: true });
};
