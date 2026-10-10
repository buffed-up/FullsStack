const { sql } = require('../config/database');

async function findAll() {
  return await sql`SELECT id, nombre FROM categorias ORDER BY id`;
}

async function findById(id) {
  const resultado = await sql`SELECT id, nombre FROM categorias WHERE id = ${id}`;
  return resultado[0];
}

async function insert(c) {
  const resultado = await sql`
    INSERT INTO categorias (nombre)
    VALUES (${c.nombre})
    RETURNING id, nombre
  `;
  return resultado[0];
}

async function update(id, c) {
  const resultado = await sql`
    UPDATE categorias
    SET nombre = ${c.nombre}
    WHERE id = ${id}
    RETURNING id, nombre
  `;
  return resultado[0];
}

async function remove(id) {
  await sql`DELETE FROM categorias WHERE id = ${id}`;
}

module.exports = {
  findAll,
  findById,
  insert,
  update,
  remove
};