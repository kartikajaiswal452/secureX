const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const File = require("../models/file");
const auth = require("../middleware/authMiddleware");

const {
  uploadFile,
  getFiles,
  deleteFile,
} = require("../controllers/filecontroller");


router.post("/upload", auth, upload.single("file"), uploadFile);


router.get("/", auth, getFiles);



router.delete("/:id", auth, deleteFile);



router.get("/download/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

  
    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

 
    res.download(file.path, file.filename + ".enc");

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


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
      shareLink: `http://localhost:3000/share/${file.shareId}`,
    });

  } catch (error) {
    console.error("SHARE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/public/:shareId", async (req, res) => {
  try {
    const file = await File.findOne({ shareId: req.params.shareId });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }


    res.download(file.path, file.filename + ".enc");

  } catch (err) {
    console.error("PUBLIC DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;