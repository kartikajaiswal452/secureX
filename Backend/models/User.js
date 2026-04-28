const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "User",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    otp: String,
    otpExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userschema);