const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // store in memory for encryption

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;