const File = require("../models/file");
const { encryptBuffer, decryptBuffer } = require("../utils/encryption");
const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadFile = async (req, res) => {
  try {
    console.log("🔥 Upload started");

    const password = req.body.password;

    if (!req.file || !password) {
      console.log("❌ Missing file or password");
      return res.status(400).json({ message: "Missing file or password" });
    }

    const { iv, data } = encryptBuffer(req.file.buffer, password);

    console.log("🔐 File encrypted");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "secure-files",
        public_id: Date.now() + "-" + req.file.originalname,
      },
      async (error, result) => {
        if (error) {
          console.log("❌ Cloudinary error:", error);
          return res.status(500).json({ message: "Upload failed" });
        }

        console.log("✅ Uploaded to Cloudinary:", result.secure_url);

        const newFile = new File({
          fileName: req.file.originalname,
          fileUrl: result.secure_url,
          iv,
          size: req.file.size,
          userId: req.user.id,
        });

        await newFile.save();

        console.log("💾 Saved in MongoDB");

        res.status(201).json(newFile);
      }
    );

    streamifier.createReadStream(data).pipe(uploadStream);

  } catch (err) {
    console.error("🔥 Upload crash:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};


const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "Not found" });

    const urlParts = file.fileUrl.split("/");
    const fileNameWithExt = urlParts[urlParts.length - 1];
    const publicId = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf("."));

    await cloudinary.uploader.destroy(`secure-files/${publicId}`, {
      resource_type: "raw",
    });

    await file.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};


const downloadFile = async (req, res) => {
  try {
    const { password } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "Not found" });

    const response = await axios.get(file.fileUrl, {
      responseType: "arraybuffer",
    });

    const encryptedData = Buffer.from(response.data);

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
    console.error(err);
    res.status(500).json({ message: "Decryption failed" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
  downloadFile,
};