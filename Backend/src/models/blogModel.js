const { sql } = require('../config/database');

async function findAll() {
  return await sql`
    SELECT b.id, b.titulo, b.resumen, b.img, b.categoria, b.fecha,
           b.usuario_id,
           u.nombre AS autor_nombre, u.apellido AS autor_apellido,
           (SELECT COUNT(*)::int FROM blog_comentarios c WHERE c.blog_id = b.id) AS total_comentarios
    FROM blogs b
    LEFT JOIN usuarios u ON u.id = b.usuario_id
    ORDER BY b.fecha DESC
  `;
}

async function findById(id) {
  const blogs = await sql`
    SELECT b.id, b.titulo, b.resumen, b.contenido, b.img, b.categoria, b.fecha,
           b.usuario_id,
           u.nombre AS autor_nombre, u.apellido AS autor_apellido
    FROM blogs b
    LEFT JOIN usuarios u ON u.id = b.usuario_id
    WHERE b.id = ${id}
  `;
  if (!blogs[0]) return null;

  const comentarios = await sql`
    SELECT c.id, c.blog_id, c.usuario_id, c.comentario, c.fecha, c.comentario_padre_id,
           u.nombre AS autor_nombre, u.apellido AS autor_apellido
    FROM blog_comentarios c
    LEFT JOIN usuarios u ON u.id = c.usuario_id
    WHERE c.blog_id = ${id}
    ORDER BY c.fecha ASC
  `;

  return { ...blogs[0], comentarios };
}

async function insert(b) {
  const r = await sql`
    INSERT INTO blogs (usuario_id, titulo, resumen, contenido, img, categoria)
    VALUES (${b.usuario_id}, ${b.titulo}, ${b.resumen}, ${b.contenido}, ${b.img}, ${b.categoria})
    RETURNING *
  `;
  return r[0];
}

async function update(id, b) {
  const r = await sql`
    UPDATE blogs
    SET titulo = ${b.titulo},
        resumen = ${b.resumen},
        contenido = ${b.contenido},
        img = ${b.img},
        categoria = ${b.categoria}
    WHERE id = ${id}
    RETURNING *
  `;
  return r[0];
}

async function remove(id) {
  await sql`DELETE FROM blogs WHERE id = ${id}`;
}

async function insertComentario(c) {
  const r = await sql`
    INSERT INTO blog_comentarios (blog_id, usuario_id, comentario, comentario_padre_id)
    VALUES (${c.blog_id}, ${c.usuario_id}, ${c.comentario}, ${c.comentario_padre_id})
    RETURNING *
  `;
  return r[0];
}

async function findComentarioById(id) {
  const r = await sql`SELECT * FROM blog_comentarios WHERE id = ${id}`;
  return r[0];
}

async function removeComentario(id) {
  await sql`DELETE FROM blog_comentarios WHERE id = ${id}`;
}

module.exports = {
  findAll,
  findById,
  insert,
  update,
  remove,
  insertComentario,
  findComentarioById,
  removeComentario
};