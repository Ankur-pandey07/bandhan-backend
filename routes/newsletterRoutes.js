const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    await axios.post(
      "https://connect.mailerlite.com/api/subscribers",
      {
        email,
        groups: [process.env.MAILERLITE_GROUP_ID],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Subscription failed" });
  }
});

module.exports = router;
