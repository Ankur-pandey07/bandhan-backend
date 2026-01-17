const Chat = require("../models/Chat");

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const chat = await Chat.create({ sender, receiver, message });

    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Chat Between Two Users
exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const chats = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
