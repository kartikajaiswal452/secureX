const User = require("../models/User");

const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");



exports.sendOtp = async (req, res) => {
  try {

    console.log("REQ BODY:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedOtp = await bcrypt.hash(
      otp,
      10
    );

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    user.otp = hashedOtp;

    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("EMAIL:", process.env.EMAIL);

    console.log(
      "APP_PASSWORD:",
      process.env.APP_PASSWORD
        ? "FOUND"
        : "MISSING"
    );

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

    await transporter.verify();

    console.log("MAIL SERVICE READY");

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      message: "OTP sent to email",
    });

  } catch (error) {

    console.log("SEND OTP ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      otp.toString(),
      user.otp,
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.isVerified = true;

    user.otp = null;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};



exports.uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id,
    );

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "profile-pictures",
        },
      );

    user.profilePic = result.secure_url;

    await user.save();

    res.json(user);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const updatedUser =
      await User.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true }
      );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updatedUser);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Profile update failed",
    });
  }
};
exports.register = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};