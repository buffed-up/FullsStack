const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

router.get('/', productosController.getProductos);
router.get('/destacados', productosController.getDestacados);
router.get('/:id', productosController.getProducto);
router.post('/', productosController.postProducto);
router.put('/:id', productosController.putProducto);
router.delete('/:id', productosController.deleteProducto);

module.exports = router;