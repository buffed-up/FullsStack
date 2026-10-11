const { sql } = require('../config/database');

// Columnas públicas (sin clave) para no exponerla en las respuestas
const COLUMNAS_PUBLICAS = sql`
  id, run, nombre, apellido, correo, fecha_nacimiento, rol, region, comuna, direccion
`;

async function findAll() {
  return await sql`
    SELECT id, run, nombre, apellido, correo, fecha_nacimiento, rol, region, comuna, direccion
    FROM usuarios ORDER BY id
  `;
}

async function findById(id) {
  const resultado = await sql`
    SELECT id, run, nombre, apellido, correo, fecha_nacimiento, rol, region, comuna, direccion
    FROM usuarios WHERE id = ${id}
  `;
  return resultado[0];
}

async function findByCorreo(correo) {
  const resultado = await sql`
    SELECT id, run, nombre, apellido, correo, fecha_nacimiento, rol, region, comuna, direccion
    FROM usuarios WHERE correo = ${correo}
  `;
  return resultado[0];
}

// Solo para login: incluye la clave
async function findByCorreoConClave(correo) {
  const resultado = await sql`
    SELECT * FROM usuarios WHERE correo = ${correo}
  `;
  return resultado[0];
}

async function insert(u) {
  const resultado = await sql`
    INSERT INTO usuarios (run, nombre, apellido, correo, fecha_nacimiento, rol, region, comuna, direccion, clave)
    VALUES (${u.run}, ${u.nombre}, ${u.apellido}, ${u.correo}, ${u.fechaNacimiento},
            ${u.rol}, ${u.region}, ${u.comuna}, ${u.direccion}, ${u.clave})
    RETURNING *
  `;
  return resultado[0];
}

async function update(id, u) {
  // Si viene clave (ya hasheada por el service), se actualiza también
  if (u.clave) {
    const resultado = await sql`
      UPDATE usuarios
      SET run = ${u.run},
          nombre = ${u.nombre},
          apellido = ${u.apellido},
          correo = ${u.correo},
          fecha_nacimiento = ${u.fechaNacimiento},
          rol = ${u.rol},
          region = ${u.region},
          comuna = ${u.comuna},
          direccion = ${u.direccion},
          clave = ${u.clave}
      WHERE id = ${id}
      RETURNING *
    `;
    return resultado[0];
  }

  // Sin clave: solo actualiza datos (comportamiento original)
  const resultado = await sql`
    UPDATE usuarios
    SET run = ${u.run},
        nombre = ${u.nombre},
        apellido = ${u.apellido},
        correo = ${u.correo},
        fecha_nacimiento = ${u.fechaNacimiento},
        rol = ${u.rol},
        region = ${u.region},
        comuna = ${u.comuna},
        direccion = ${u.direccion}
    WHERE id = ${id}
    RETURNING *
  `;
  return resultado[0];
}

async function remove(id) {
  await sql`DELETE FROM usuarios WHERE id = ${id}`;
}

module.exports = {
  findAll,
  findById,
  findByCorreo,
  findByCorreoConClave,
  insert,
  update,
  remove
};