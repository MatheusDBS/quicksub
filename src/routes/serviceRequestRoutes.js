const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/serviceRequestController');
const ServiceRequest = require('../models/ServiceRequest');

// Usuário faz request
router.post('/', auth, controller.criarRequest);
// Admin lista todas
router.get('/', auth, controller.listarRequests);
// Admin responde
router.put('/:id', auth, controller.responderRequest);
// Marcar como lida por usuário
router.put('/:id/lida', auth, controller.marcarComoLida);
// Rota para requests não lidas do usuário
router.get('/user/:userId/nao-lidas', auth, controller.listarNaoLidasPorUsuario);

module.exports = router;
