const express = require('express');
const router = express.Router();
const contactosController = require('../controllers/contactosController');

router.post('/', contactosController.postContacto);
router.get('/', contactosController.getContactos);

module.exports = router;