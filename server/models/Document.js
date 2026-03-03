const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Store as local path or URL
  rawText: { type: String }, // Extracted via pdf-parse
  fileSize: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', documentSchema);
