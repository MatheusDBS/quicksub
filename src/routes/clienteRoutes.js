const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const auth = require('../middleware/auth');

router.post('/', auth, clienteController.create);
router.get('/', auth, clienteController.getAll);
router.get('/:id', auth, clienteController.getById);
router.put('/:id', auth, clienteController.update);
router.delete('/:id', auth, clienteController.delete);

module.exports = router;
