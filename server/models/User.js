const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  quizScores: [{
    docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    score: Number,
    total: Number,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', userSchema);
