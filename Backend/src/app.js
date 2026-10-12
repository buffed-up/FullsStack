require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend funcionando' });
});

const productosRoutes = require('./routes/productosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const uploadsRoutes = require('./routes/uploadsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactosRoutes = require('./routes/contactosRoutes');

app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contactos', contactosRoutes);

module.exports = app;