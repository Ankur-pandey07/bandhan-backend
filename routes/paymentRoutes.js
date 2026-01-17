const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * CREATE ORDER
 */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;

    const prices = {
      plus: 499,
      gold: 999,
      platinum: 1499,
    };

    if (!prices[plan]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const order = await razorpay.orders.create({
      amount: prices[plan] * 100, // paise
      currency: "INR",
      receipt: `bandhan_${Date.now()}`,
    });

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/**
 * VERIFY PAYMENT + ACTIVATE PREMIUM
 */
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Activate premium
    const user = await User.findById(req.userId);
    user.isPremium = true;
    user.premiumPlan = plan;
    user.premiumExpiry = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );
    await user.save();
await sendEmail(
  user.email,
  "Your Bandhan Premium is Active 🎉",
  `
  <h2>Premium Activated</h2>
  <p>Your <b>${plan}</b> plan is now active.</p>
  <p>Valid till: ${user.premiumExpiry.toDateString()}</p>
  `
);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification error" });
  }
});

module.exports = router;
