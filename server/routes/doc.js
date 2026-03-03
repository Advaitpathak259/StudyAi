const express = require('express');
const router = express.Router();
const multer = require('multer');
const docController = require('../controllers/docController');
const auth = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, upload.single('file'), docController.uploadDocument);
router.get('/', auth, docController.getDocuments);
router.get('/:id', auth, docController.getDocument);
router.delete('/:id', auth, docController.deleteDocument);

module.exports = router;
