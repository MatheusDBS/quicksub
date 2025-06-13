const express = require('express');
const router = express.Router();
const assinaturaController = require('../controllers/assinaturaController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../quicksub-frontend/public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', auth, upload.single('foto'), assinaturaController.create);
router.get('/', auth, assinaturaController.getAll);
router.get('/:id', auth, assinaturaController.getById);
router.put('/:id', auth, assinaturaController.update);
router.delete('/:id', auth, assinaturaController.delete);

module.exports = router;
