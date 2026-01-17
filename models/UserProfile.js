const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    // 🔗 User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🧍 Basic Info
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    lookingFor: {
      type: String,
      enum: ["Male", "Female", "Everyone"],
      required: true,
    },

    location: {
      type: String, // city only
      required: true,
      trim: true,
    },

    // 📸 Photos (2–6 mandatory)
    photos: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length >= 2 && v.length <= 6;
        },
        message: "Minimum 2 and maximum 6 photos required",
      },
    },

    profilePhoto: {
      type: String,
      required: true,
    },

    // ✍️ Bio
    bio: {
      type: String,
      minlength: 30,
      maxlength: 300,
      required: true,
    },

    // 🎯 Interests
    interests: {
      type: [String],
      default: [],
    },

    // 🎥 Reel (optional – only 1)
    reel: {
      type: String,
      default: null,
    },

    // 📊 Profile completion system
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    completionPercent: {
      type: Number,
      default: 0,
    },

    // 🚫 Future control
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
