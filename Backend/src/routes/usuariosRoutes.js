const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
 
 
router.post('/login', usuariosController.login);
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuario);
router.post('/', usuariosController.postUsuario);
router.put('/:id', usuariosController.putUsuario);
router.delete('/:id', usuariosController.deleteUsuario);
 
 
module.exports = router;