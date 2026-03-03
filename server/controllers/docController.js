const Document = require('../models/Document');
const pdf = require('pdf-parse');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const newDoc = new Document({
      userId: req.userData.userId,
      name: req.file.originalname,
      fileUrl: req.file.path,
      rawText: pdfData.text,
      fileSize: req.file.size
    });

    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.userData.userId }).select('-rawText');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocument = async (req, res) => {
    try {
      const doc = await Document.findOne({ _id: req.params.id, userId: req.userData.userId });
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.userData.userId });
    if (doc && fs.existsSync(doc.fileUrl)) {
      fs.unlinkSync(doc.fileUrl);
    }
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
