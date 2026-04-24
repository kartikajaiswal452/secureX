const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },

  data: { type: String, required: true },

  size: { type: Number },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  shareId: {
    type: String,
    sparse: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.File || mongoose.model("File", fileSchema);