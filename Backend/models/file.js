const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shareId: {         
    type: String,
    sparse: true      
  }
});

module.exports = mongoose.models.File || mongoose.model("File", fileSchema);