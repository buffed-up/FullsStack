const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

router.get('/', categoriasController.getCategorias);
router.get('/:id', categoriasController.getCategoria);
router.post('/', categoriasController.postCategoria);
router.put('/:id', categoriasController.putCategoria);
router.delete('/:id', categoriasController.deleteCategoria);

module.exports = router;