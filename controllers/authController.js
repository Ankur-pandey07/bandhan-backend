const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

/* ================= REQUEST OTP ================= */
exports.requestSignupOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ❗ block only VERIFIED users
    const verifiedUser = await User.findOne({
      email,
      isEmailVerified: true,
    });

    if (verifiedUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    // upsert temp user
    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        resetOtp: otp,
        resetOtpExpire: Date.now() + 10 * 60 * 1000,
        isEmailVerified: false,
      },
      { upsert: true, new: true }
    );

    console.log("📩 OTP SENT:", email, otp);

    await sendEmail(
      email,
      "Verify your Bandhan email",
      `Your OTP is ${otp}. Valid for 10 minutes.`
    );

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("OTP SEND ERROR:", err);
    res.status(500).json({ message: "OTP send failed" });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.resetOtp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (
      user.resetOtp !== otp ||
      user.resetOtpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.resetOtp = null;
    user.resetOtpExpire = null;
    await user.save();

    res.json({ success: true, message: "Email verified" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "OTP verify failed" });
  }
};

/* ================= RESEND OTP ================= */
exports.resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Signup not initiated" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log("🔁 OTP RESENT:", email, otp);

    await sendEmail(
      email,
      "Your Bandhan OTP",
      `Your OTP is ${otp}. Valid for 10 minutes.`
    );

    res.json({ success: true });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({ message: "Resend failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      email,
      isEmailVerified: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log("🔐 FORGOT OTP:", email, otp);

    await sendEmail(
      email,
      "Bandhan Password Reset OTP",
      `Your OTP is ${otp}. Valid for 10 minutes.`
    );

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.forgotPasswordOtp !== otp ||
      user.forgotPasswordOtpExpire < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("VERIFY FORGOT OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.forgotPasswordOtp = null;
    user.forgotPasswordOtpExpire = null;

    await user.save();

    await sendEmail(
      email,
      "Password Changed Successfully",
      "Your Bandhan account password has been changed."
    );

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({
      email,
      isEmailVerified: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ME ================= */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGOUT ================= */
exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};
