const { sql } = require('../config/database');

async function findAll() {
  return await sql`SELECT * FROM productos ORDER BY id`;
}

async function findIndividuales() {
  return await sql`
    SELECT * FROM productos
    WHERE coleccion IS NULL
    ORDER BY id
  `;
}

async function findById(id) {
  const resultado = await sql`SELECT * FROM productos WHERE id = ${id}`;
  return resultado[0];
}

async function findDestacados() {
  return await sql`
    SELECT * FROM productos
    WHERE es_portada = TRUE
    ORDER BY orden_destacado
  `;
}

async function findByColeccion(nombre) {
  return await sql`
    SELECT * FROM productos
    WHERE coleccion = ${nombre}
    ORDER BY id
  `;
}

async function insert({ titulo, precio, img, descripcion, categoria_id, coleccion, stock }) {
  const resultado = await sql`
    INSERT INTO productos (titulo, precio, img, descripcion, categoria_id, coleccion, stock)
    VALUES (${titulo}, ${precio}, ${img}, ${descripcion}, ${categoria_id}, ${coleccion}, ${stock ?? 0})
    RETURNING *
  `;
  return resultado[0];
}

async function update(id, { titulo, precio, img, descripcion, categoria_id, coleccion, stock }) {
  const resultado = await sql`
    UPDATE productos
    SET titulo = ${titulo},
        precio = ${precio},
        img = ${img},
        descripcion = ${descripcion},
        categoria_id = ${categoria_id},
        coleccion = ${coleccion},
        stock = ${stock ?? 0}
    WHERE id = ${id}
    RETURNING *
  `;
  return resultado[0];
}

async function remove(id) {
  await sql`DELETE FROM productos WHERE id = ${id}`;
}

module.exports = {
  findAll,
  findIndividuales,
  findById,
  findDestacados,
  findByColeccion,
  insert,
  update,
  remove
};