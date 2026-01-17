const User = require("../models/User");

/* ================= GET ALL USERS ================= */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET SINGLE USER ================= */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LIKE + MATCH ================= */
exports.likeUser = async (req, res) => {
  try {
    const userId = req.userId; // 🔐 Token se aaya
    const targetId = req.body.targetId;

    if (!targetId) {
      return res.status(400).json({ message: "targetId missing" });
    }

    if (userId === targetId) {
      return res.status(400).json({ message: "Cannot like yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already liked?
    if (user.likes.includes(targetId)) {
      return res.json({ message: "Already liked", match: false });
    }

    // Add like
    user.likes.push(targetId);
    await user.save();

    // Check if match
    if (target.likes.includes(userId)) {
      // Add each other
      if (!user.matches.includes(targetId)) {
        user.matches.push(targetId);
      }

      if (!target.matches.includes(userId)) {
        target.matches.push(userId);
      }

      await user.save();
      await target.save();

      return res.json({
        message: "🎉 It's a MATCH!",
        match: true,
      });
    }

    res.json({
      message: "Like added",
      match: false,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
