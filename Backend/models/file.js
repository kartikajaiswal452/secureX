const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: String,

   fileUrl: String,
  iv: String,
  size: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("File", fileSchema);