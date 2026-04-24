const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp } = require("../controllers/authcontroller");

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

module.exports = router;