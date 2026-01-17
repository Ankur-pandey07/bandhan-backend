const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: Number,

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    city: String,

    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    isPremium: {
      type: Boolean,
      default: false,
    },

    premiumExpiry: Date,

    resetOtp: String,
    resetOtpExpire: Date,
    
    forgotPasswordOtp: String,
forgotPasswordOtpExpire: Date,


    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
