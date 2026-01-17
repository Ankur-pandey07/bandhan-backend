const express = require("express");
const router = express.Router();

const User = require("../models/User");
const {
  getUsers,
  getUser,
  updateProfile,
  likeUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");


// =========================
// DASHBOARD — RETURN USERS
// =========================
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const myId = req.userId;

    const users = await User.find({ _id: { $ne: myId } })
      .select("-password")
      .limit(200);

    return res.json({
      success: true,
      users,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// =========================
// PUBLIC ROUTES
// =========================
router.get("/", getUsers);
router.get("/:id", getUser);


// =========================
// UPDATE PROFILE
// =========================
router.put("/:id", authMiddleware, updateProfile);


// =========================
// LIKE
// =========================
router.post("/like", authMiddleware, likeUser);

module.exports = router;
