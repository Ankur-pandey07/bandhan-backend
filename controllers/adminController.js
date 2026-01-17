const User = require("../models/User");

// Simple admin login (static credentials)
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@bandhan.com" && password === "admin123") {
    return res.json({ success: true, message: "Admin logged in" });
  }

  res.status(400).json({ success: false, message: "Invalid admin credentials" });
};

// Get all users (admin only)
exports.adminGetUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.adminDeleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
