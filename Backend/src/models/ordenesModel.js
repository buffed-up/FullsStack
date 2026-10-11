const { sql } = require('../config/database');

async function findAll() {
  return await sql`
    SELECT o.id, o.usuario_id, o.fecha, o.total, o.estado,
           o.nombre_envio, o.apellido_envio, o.correo_envio,
           o.direccion, o.region, o.comuna, o.indicaciones,
           u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
           u.correo AS usuario_correo
    FROM ordenes o
    LEFT JOIN usuarios u ON u.id = o.usuario_id
    ORDER BY o.id DESC
  `;
}

async function findById(id) {
  const ordenes = await sql`
    SELECT o.id, o.usuario_id, o.fecha, o.total, o.estado,
           o.nombre_envio, o.apellido_envio, o.correo_envio,
           o.direccion, o.region, o.comuna, o.indicaciones,
           u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
           u.correo AS usuario_correo
    FROM ordenes o
    LEFT JOIN usuarios u ON u.id = o.usuario_id
    WHERE o.id = ${id}
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
    SELECT o.id, o.usuario_id, o.fecha, o.total, o.estado,
           o.nombre_envio, o.apellido_envio, o.correo_envio,
           o.direccion, o.region, o.comuna, o.indicaciones,
           u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
           u.correo AS usuario_correo
    FROM ordenes o
    LEFT JOIN usuarios u ON u.id = o.usuario_id
    WHERE o.usuario_id = ${usuarioId}
    ORDER BY o.id DESC
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