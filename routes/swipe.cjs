const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { targetUserId, action } = req.body;

  if (!targetUserId || !action) {
    return res.status(400).json({ success: false });
  }

  const isMatch =
    (action === "like" || action === "superlike") &&
    Math.random() > 0.7;

  res.json({
    success: true,
    match: isMatch,
  });
});

module.exports = router;
