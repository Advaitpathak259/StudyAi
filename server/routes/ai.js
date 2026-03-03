const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/chat/:docId', auth, aiController.chatWithDoc);
router.get('/quiz/:docId', auth, aiController.generateQuiz);
//router.get('/flashcards/:docId', auth, aiController.generateFlashcards);

module.exports = router;
