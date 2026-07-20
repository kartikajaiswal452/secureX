const express = require("express");

const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  register,
  login,
} = require("../controllers/authcontroller");

router.post("/sendOtp", sendOtp);

router.post("/verifyOtp", verifyOtp);

router.post("/register", register);

router.post("/login", login);

module.exports = router;