const categoriasService = require('../services/categoriasService');

async function getCategorias(req, res) {
  try {
    const categorias = await categoriasService.listarCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getCategoria(req, res) {
  try {
    const categoria = await categoriasService.obtenerCategoria(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function postCategoria(req, res) {
  try {
    const nueva = await categoriasService.crearCategoria(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function putCategoria(req, res) {
  try {
    const actualizada = await categoriasService.actualizarCategoria(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(actualizada);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function deleteCategoria(req, res) {
  try {
    await categoriasService.eliminarCategoria(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = {
  getCategorias,
  getCategoria,
  postCategoria,
  putCategoria,
  deleteCategoria
};