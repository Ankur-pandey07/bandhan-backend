const UserProfile = require("../models/UserProfile");

const checkProfileCompletion = async (req, res, next) => {
  try {
    const userId = req.userId; // authMiddleware se aa raha

    const profile = await UserProfile.findOne({ userId });

    // ❌ Profile hi nahi hai
    if (!profile) {
      return res.status(200).json({
        profileExists: false,
        profileCompleted: false,
        redirect: "/profile/create",
        message: "Profile not created",
      });
    }

    // ⚠️ Profile incomplete hai
    if (!profile.profileCompleted) {
      return res.status(200).json({
        profileExists: true,
        profileCompleted: false,
        completionPercent: profile.completionPercent,
        redirect: "/profile/create",
        message: "Profile incomplete",
      });
    }

    // ✅ Profile complete
    req.profile = profile; // future use
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Profile completion check failed",
    });
  }
};

module.exports = checkProfileCompletion;
