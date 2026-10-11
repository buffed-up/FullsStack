const reportesService = require('../services/reportesService');

async function getReportes(req, res) {
  try {
    const reportes = await reportesService.obtenerReportes();
    res.json(reportes);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = { getReportes };