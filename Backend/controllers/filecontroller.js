const fs = require("fs");
const path = require("path");
const File = require("../models/file");
const { encryptBuffer } = require("../utils/encryption");

// =========================
// 📤 UPLOAD + ENCRYPT FILE
// =========================
const uploadFile = async (req, res) => {
  try {
    const password = req.body.password;

    if (!req.file || !password) {
      return res.status(400).json({ message: "Missing file or password" });
    }

    // 🔐 Encrypt file buffer
    const { iv, data } = encryptBuffer(req.file.buffer, password);

    // 📁 Save encrypted file
    const fileName = Date.now() + "-" + req.file.originalname + ".enc";
    const filePath = path.join(__dirname, "../uploads", fileName);

    fs.writeFileSync(filePath, data);

    // 💾 Save metadata
    const newFile = new File({
      fileName: req.file.originalname,
      filePath,
      iv,
      size: req.file.size,
      userId: req.user.id,
    });

    await newFile.save();

    res.status(201).json(newFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};
// =========================
// 📂 GET ALL FILES
// =========================
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(files);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

// =========================
// 🗑 DELETE FILE
// =========================


const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🧹 delete file from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

// =========================
// 🔓 DECRYPT + DOWNLOAD FILE
// =========================
const downloadFile = async (req, res) => {
  try {
    const { password } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "Not found" });

    const encryptedData = fs.readFileSync(file.filePath);

    const { decryptBuffer } = require("../utils/encryption");

    const decrypted = decryptBuffer(
      encryptedData,
      file.iv,
      password
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`
    );

    res.send(decrypted);
  } catch (err) {
    res.status(500).json({ message: "Decryption failed (wrong password?)" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
  downloadFile,
};