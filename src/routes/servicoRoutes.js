const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const auth = require('../middleware/auth');

router.post('/', auth, servicoController.create);
router.get('/', auth, servicoController.getAll);
router.get('/:id', auth, servicoController.getById);
router.put('/:id', auth, servicoController.update);
router.delete('/:id', auth, servicoController.delete);

module.exports = router;
