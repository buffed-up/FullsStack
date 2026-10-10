const { sql } = require('../config/database');

async function findAll() {
  return await sql`
    SELECT id, usuario_id, fecha, total, estado, nombre_envio, apellido_envio,
           correo_envio, direccion, region, comuna, indicaciones
    FROM ordenes ORDER BY id DESC
  `;
}

async function findById(id) {
  const ordenes = await sql`
    SELECT id, usuario_id, fecha, total, estado, nombre_envio, apellido_envio,
           correo_envio, direccion, region, comuna, indicaciones
    FROM ordenes WHERE id = ${id}
  `;
  if (!ordenes[0]) return null;

  const items = await sql`
    SELECT oi.id, oi.producto_id, oi.cantidad, oi.precio_unitario,
           p.titulo, p.img
    FROM orden_items oi
    LEFT JOIN productos p ON p.id = oi.producto_id
    WHERE oi.orden_id = ${id}
    ORDER BY oi.id
  `;

  return { ...ordenes[0], items };
}

async function findByUsuario(usuarioId) {
  return await sql`
    SELECT id, usuario_id, fecha, total, estado, nombre_envio, apellido_envio,
           correo_envio, direccion, region, comuna, indicaciones
    FROM ordenes WHERE usuario_id = ${usuarioId} ORDER BY id DESC
  `;
}

async function updateEstado(id, estado) {
  const resultado = await sql`
    UPDATE ordenes SET estado = ${estado}
    WHERE id = ${id}
    RETURNING id, usuario_id, fecha, total, estado
  `;
  return resultado[0];
}

async function getPrecioProducto(productoId) {
  const r = await sql`SELECT id, precio FROM productos WHERE id = ${productoId}`;
  return r[0];
}

module.exports = {
  findAll,
  findById,
  findByUsuario,
  updateEstado,
  getPrecioProducto
};