const express = require("express");
const UserProfile = require("../models/UserProfile");
const upload = require("../middleware/uploadMedia");
const authMiddleware = require("../middleware/authMiddleware");
const checkProfileCompletion = require("../middleware/profileCompletion");

const router = express.Router();

/* =====================================================
   CREATE PROFILE
   ===================================================== */
router.post(
  "/create",
  authMiddleware,
  upload.fields([
    { name: "photos", maxCount: 6 },
    { name: "reel", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.userId; // authMiddleware se aa raha

      // ❌ Prevent duplicate profile
      const exists = await UserProfile.findOne({ userId });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Profile already exists",
        });
      }

      const {
        fullName,
        dob,
        gender,
        lookingFor,
        location,
        bio,
        interests,
      } = req.body;

      // 📸 Photos
      const photos = req.files?.photos?.map((f) => f.path) || [];
      if (photos.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Minimum 2 photos required",
        });
      }

      // 🎥 Reel (optional)
      const reel = req.files?.reel ? req.files.reel[0].path : null;

      // 🎂 Age calculation
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // 📊 Completion logic
      let completion = 0;
      if (photos.length >= 2) completion += 30;
      if (bio && bio.length >= 30) completion += 20;
      if (fullName && gender && location) completion += 25;
      if (interests && interests.length > 0) completion += 15;
      if (reel) completion += 10;

      const profile = await UserProfile.create({
        userId,
        fullName,
        dob,
        age,
        gender,
        lookingFor,
        location,
        photos,
        profilePhoto: photos[0],
        bio,
        interests: interests ? interests.split(",") : [],
        reel,
        completionPercent: completion,
        profileCompleted: completion >= 70,
      });

      res.status(201).json({
        success: true,
        message: "Profile created successfully",
        profileCompleted: profile.profileCompleted,
        completionPercent: profile.completionPercent,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/* =====================================================
   PROFILE STATUS CHECK (LOGIN KE BAAD)
   ===================================================== */
router.get(
  "/status",
  authMiddleware,
  checkProfileCompletion,
  (req, res) => {
    // yaha tab aayega jab profile COMPLETE ho
    res.json({
      profileExists: true,
      profileCompleted: true,
      redirect: "/swipe",
    });
  }
);

/* =====================================================
   GET PROFILE BY USER ID
   ===================================================== */
router.get("/get/:userId", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.params.userId,
    });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
