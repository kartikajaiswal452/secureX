const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const { decryptBuffer } = require("../utils/encryption");

const upload = require("../middleware/upload");
const File = require("../models/file");
const auth = require("../middleware/authMiddleware");

const {
  uploadFile,
  getFiles,
  deleteFile,
  downloadFile
} = require("../controllers/filecontroller");




router.post("/upload", auth, upload.single("file"), uploadFile);



router.get("/", auth, getFiles);



router.delete("/:id", auth, deleteFile);


router.post("/download/:id", auth, downloadFile);
router.get("/share/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!file.shareId) {
      file.shareId = uuidv4();
      await file.save();
    }
    res.json({
      shareLink: `${req.protocol}://${req.get("host")}/api/files/public/${file.shareId}`,
    });
  } catch (err) {
    console.error("SHARE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/public/:shareId", async (req, res) => {
  try {
    const file = await File.findOne({ shareId: req.params.shareId });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const encryptedData = fs.readFileSync(file.filePath);
    const decrypted = decryptBuffer(encryptedData, file.iv, password);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`
    );

    res.send(decrypted);

  } catch (err) {
    res.status(500).json({ message: "Wrong password or error" });
  }
});

module.exports = router;