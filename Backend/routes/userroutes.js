const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const {
  uploadProfilePic,
  updateProfile,
} = require("../controllers/usercontroller");

// Upload profile image
router.post(
  "/upload-profile",
  auth,
  upload.single("image"),
  uploadProfilePic,
);

// Update profile
router.put(
  "/update-profile",
  auth,
  updateProfile,
);

module.exports = router;