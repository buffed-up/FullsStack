const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');

// Rutas específicas ANTES que /:id
router.get('/usuario/:usuarioId', ordenesController.getOrdenesDeUsuario);

router.get('/', ordenesController.getOrdenes);
router.get('/:id', ordenesController.getOrden);
router.post('/', ordenesController.postOrden);
router.put('/:id', ordenesController.putEstadoOrden);

module.exports = router;