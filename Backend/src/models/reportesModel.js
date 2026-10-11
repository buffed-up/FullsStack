const { sql } = require('../config/database');

async function ventasTotales() {
  const r = await sql`
    SELECT
      COALESCE(SUM(total), 0)::int AS total,
      COUNT(*)::int AS cantidad
    FROM ordenes
    WHERE estado <> 'cancelada'
  `;
  return r[0];
}

async function boletasPorEstado() {
  return await sql`
    SELECT estado, COUNT(*)::int AS cantidad
    FROM ordenes
    GROUP BY estado
    ORDER BY cantidad DESC
  `;
}

async function productosPorCategoria() {
  return await sql`
    SELECT
      c.nombre AS categoria,
      COUNT(p.id)::int AS cantidad
    FROM categorias c
    LEFT JOIN productos p ON p.categoria_id = c.id
    GROUP BY c.nombre
    ORDER BY cantidad DESC
  `;
}

async function productosMasVendidos() {
  return await sql`
    SELECT
      p.id AS producto_id,
      p.titulo,
      p.stock,
      COALESCE(SUM(oi.cantidad), 0)::int AS total_vendido
    FROM productos p
    LEFT JOIN orden_items oi ON oi.producto_id = p.id
    GROUP BY p.id, p.titulo, p.stock
    ORDER BY total_vendido DESC, p.titulo
    LIMIT 10
  `;
}

async function ingresosPorMes() {
  return await sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', fecha), 'YYYY-MM') AS mes,
      COALESCE(SUM(total), 0)::int AS total,
      COUNT(*)::int AS cantidad
    FROM ordenes
    WHERE estado <> 'cancelada'
    GROUP BY DATE_TRUNC('month', fecha)
    ORDER BY DATE_TRUNC('month', fecha) DESC
  `;
}

async function productosCriticos() {
  return await sql`
    SELECT id, titulo, stock, precio
    FROM productos
    WHERE stock <= 5
    ORDER BY stock ASC, titulo
  `;
}

module.exports = {
  ventasTotales,
  boletasPorEstado,
  productosPorCategoria,
  productosMasVendidos,
  ingresosPorMes,
  productosCriticos
};