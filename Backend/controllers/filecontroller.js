const File = require("../models/file");


// =========================
// 📤 Upload File (Encrypted)
// =========================
exports.uploadFile = async (req, res) => {
  try {
    const file = new File({
      filename: req.body.fileName + ".enc", // fix extension
      path: req.file.path,
      size: req.file.size,
      userId: req.user.id,
    });

    const savedFile = await file.save();

    res.json({
      message: "Encrypted file saved successfully 🔐",
      file: savedFile, // ✅ VERY IMPORTANT
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};


// =========================
// 📄 Get Files (User)
// =========================
exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id });
    res.json(files);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};


// =========================
// ❌ Delete File
// =========================
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // 🔐 Only owner can delete
    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // delete from DB
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};