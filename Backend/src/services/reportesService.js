const reportesModel = require('../models/reportesModel');

async function obtenerReportes() {
  const [
    ventasTotales,
    boletasPorEstado,
    productosPorCategoria,
    productosMasVendidos,
    ingresosPorMes,
    productosCriticos
  ] = await Promise.all([
    reportesModel.ventasTotales(),
    reportesModel.boletasPorEstado(),
    reportesModel.productosPorCategoria(),
    reportesModel.productosMasVendidos(),
    reportesModel.ingresosPorMes(),
    reportesModel.productosCriticos()
  ]);

  return {
    ventasTotales,
    boletasPorEstado,
    productosPorCategoria,
    productosMasVendidos,
    ingresosPorMes,
    productosCriticos
  };
}

module.exports = { obtenerReportes };