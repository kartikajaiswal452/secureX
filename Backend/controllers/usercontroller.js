const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file" });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "profile-pics",
        public_id: "user-" + req.user.id,
        overwrite: true, // replace old image
      },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Upload failed" });
        }

        const user = await User.findByIdAndUpdate(
          req.user.id,
          { profilePic: result.secure_url },
          { new: true }
        );

        res.json(user);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading profile pic" });
  }
};

module.exports = { uploadProfilePic };