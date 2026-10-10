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
const categoriasRoutes = require('./routes/categoriasRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');


app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/ordenes', ordenesRoutes);


module.exports = app;