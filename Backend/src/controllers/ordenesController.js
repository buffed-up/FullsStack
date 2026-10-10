const ordenesService = require('../services/ordenesService');

async function getOrdenes(req, res) {
  try {
    const ordenes = await ordenesService.listarOrdenes();
    res.json(ordenes);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getOrden(req, res) {
  try {
    const orden = await ordenesService.obtenerOrden(req.params.id);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(orden);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getOrdenesDeUsuario(req, res) {
  try {
    const ordenes = await ordenesService.listarPorUsuario(req.params.usuarioId);
    res.json(ordenes);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function postOrden(req, res) {
  try {
    const nueva = await ordenesService.crearOrden(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function putEstadoOrden(req, res) {
  try {
    const actualizada = await ordenesService.actualizarEstado(req.params.id, req.body.estado);
    res.json(actualizada);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = {
  getOrdenes,
  getOrden,
  getOrdenesDeUsuario,
  postOrden,
  putEstadoOrden
};