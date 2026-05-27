const express = require("express");

const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  register,
} = require("../controllers/authcontroller");

router.post("/sendOtp", sendOtp);

router.post("/verifyOtp", verifyOtp);

router.post("/register", register);

module.exports = router;