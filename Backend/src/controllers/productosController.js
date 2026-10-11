const productosService = require('../services/productosService');

async function getProductos(req, res) {
  try {
    const { coleccion } = req.query;
    const productos = coleccion
      ? await productosService.listarPorColeccion(coleccion)
      : await productosService.listarTodos();
    res.json(productos);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getDestacados(req, res) {
  try {
    const destacados = await productosService.listarDestacados();
    res.json(destacados);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getProducto(req, res) {
  try {
    const producto = await productosService.obtenerProducto(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function postProducto(req, res) {
  try {
    const nuevo = await productosService.crearProducto(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function putProducto(req, res) {
  try {
    const actualizado = await productosService.actualizarProducto(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function deleteProducto(req, res) {
  try {
    await productosService.eliminarProducto(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = {
  getProductos,
  getDestacados,
  getProducto,
  postProducto,
  putProducto,
  deleteProducto
};