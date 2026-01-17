const UserProfile = require("../models/UserProfile");
const { calculateAge, calculateCompletion } = require("../utils/profileUtils");

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // ❌ Prevent duplicate profile
    const exists = await UserProfile.findOne({ userId });
    if (exists) {
      return res.status(400).json({ message: "Profile already exists" });
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
    const photos = req.files.photos?.map((f) => f.path) || [];
    if (photos.length < 2) {
      return res.status(400).json({ message: "Minimum 2 photos required" });
    }

    // 🎥 Reel
    const reel = req.files.reel ? req.files.reel[0].path : null;

    // 🎂 Age
    const age = calculateAge(dob);

    const profileData = {
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
    };

    // 📊 Completion
    const completionPercent = calculateCompletion(profileData);
    profileData.completionPercent = completionPercent;
    profileData.profileCompleted = completionPercent >= 70;

    const profile = await UserProfile.create(profileData);

    res.status(201).json({
      message: "Profile created successfully",
      profileCompleted: profile.profileCompleted,
      completionPercent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile creation failed" });
  }
};
