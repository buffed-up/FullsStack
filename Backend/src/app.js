require('dotenv').config();
const express = require('express');
const cors = require('cors');
 
 
const app = express();
 
 
app.use(cors());
app.use(express.json());
 
 
app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend funcionando' });
});
 
 
const productosRoutes = require('./routes/productosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
 
 
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
 
 
module.exports = app;