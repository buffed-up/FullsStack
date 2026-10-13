const { sql } = require('../config/database');
const ordenesModel = require('../models/ordenesModel');

const ESTADOS_VALIDOS = ['pendiente', 'pagada', 'enviada', 'cancelada'];

async function listarOrdenes() {
  return await ordenesModel.findAll();
}

async function obtenerOrden(id) {
  return await ordenesModel.findById(id);
}

async function listarPorUsuario(usuarioId) {
  return await ordenesModel.findByUsuario(usuarioId);
}

async function crearOrden(datos) {
  if (!datos.usuario_id) {
    const e = new Error('usuario_id es obligatorio');
    e.status = 400;
    throw e;
  }
  if (!Array.isArray(datos.items) || datos.items.length === 0) {
    const e = new Error('La orden debe tener al menos un ítem');
    e.status = 400;
    throw e;
  }

  // FASE 1: resolver productos, validar stock y calcular total
  let total = 0;
  const itemsResueltos = [];
  for (const item of datos.items) {
    if (!item.producto_id || !item.cantidad || item.cantidad <= 0) {
      const e = new Error('Cada ítem necesita producto_id y cantidad > 0');
      e.status = 400;
      throw e;
    }
    const producto = await ordenesModel.getPrecioStockProducto(item.producto_id);
    if (!producto) {
      const e = new Error(`Producto ${item.producto_id} no existe`);
      e.status = 400;
      throw e;
    }
    if (producto.stock < item.cantidad) {
      const e = new Error(`Stock insuficiente para "${producto.titulo}" (disponible: ${producto.stock})`);
      e.status = 400;
      throw e;
    }
    total += producto.precio * item.cantidad;
    itemsResueltos.push({
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: producto.precio
    });
  }

  // FASE 2: insertar orden + items + descontar stock, todo en una transacción
  const queries = [
    sql`
      INSERT INTO ordenes (
        usuario_id, total, estado,
        nombre_envio, apellido_envio, correo_envio,
        direccion, region, comuna, indicaciones
      )
      VALUES (
        ${datos.usuario_id}, ${total}, 'pendiente',
        ${datos.nombre_envio || null}, ${datos.apellido_envio || null}, ${datos.correo_envio || null},
        ${datos.direccion || null}, ${datos.region || null}, ${datos.comuna || null}, ${datos.indicaciones || null}
      )
      RETURNING id
    `,
    ...itemsResueltos.map(it => sql`
      INSERT INTO orden_items (orden_id, producto_id, cantidad, precio_unitario)
      VALUES (
        (SELECT id FROM ordenes ORDER BY id DESC LIMIT 1),
        ${it.producto_id},
        ${it.cantidad},
        ${it.precio_unitario}
      )
    `),
    ...itemsResueltos.map(it => sql`
      UPDATE productos
      SET stock = stock - ${it.cantidad}
      WHERE id = ${it.producto_id}
    `)
  ];

  const resultados = await sql.transaction(queries);
  const ordenId = resultados[0][0].id;

  return await ordenesModel.findById(ordenId);
}

async function actualizarEstado(id, estado) {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    const e = new Error(`estado inválido. Permitidos: ${ESTADOS_VALIDOS.join(', ')}`);
    e.status = 400;
    throw e;
  }
  const actualizada = await ordenesModel.updateEstado(id, estado);
  if (!actualizada) {
    const e = new Error('Orden no encontrada');
    e.status = 404;
    throw e;
  }
  return actualizada;
}

module.exports = {
  listarOrdenes,
  obtenerOrden,
  listarPorUsuario,
  crearOrden,
  actualizarEstado
};