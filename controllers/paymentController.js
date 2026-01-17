const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER (amount FIXED on backend)
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: 299 * 100, // ₹299 only (safe)
      currency: "INR",
      receipt: `bandhan_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // ✅ Payment verified → user premium
    await User.findByIdAndUpdate(userId, { isPremium: true });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.activatePremium = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.isPremium = true;
    user.premiumExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await user.save();

    res.json({ message: "Premium activated!" });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};
