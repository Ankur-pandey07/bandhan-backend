const express = require("express");
const router = express.Router();

const {
  requestSignupOtp,
  verifySignupOtp,
  resendSignupOtp,
  login,
  me,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// 🔐 AUTH ROUTES ONLY
router.post("/signup/request-otp", requestSignupOtp);
router.post("/signup/verify-otp", verifySignupOtp);
router.post("/signup/resend-otp", resendSignupOtp);

router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/reset", resetPassword);

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

module.exports = router;
