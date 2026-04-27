const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadProfilePic } = require("../controllers/usercontroller");

router.post("/upload-profile", auth, upload.single("image"), uploadProfilePic);

module.exports = router;