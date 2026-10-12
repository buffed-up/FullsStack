const { sql } = require('../config/database');

// POST /api/contactos - Guardar un mensaje de contacto
async function postContacto(req, res) {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await sql`
      INSERT INTO contactos (nombre, email, asunto, mensaje)
      VALUES (${nombre}, ${email}, ${asunto}, ${mensaje})
      RETURNING *
    `;

    res.status(201).json({
      mensaje: 'Contacto registrado exitosamente',
      contacto: result[0]
    });
  } catch (err) {
    console.error('Error al guardar contacto:', err);
    res.status(500).json({ error: 'Error al guardar el contacto' });
  }
}

// GET /api/contactos - Ver todos los contactos
async function getContactos(req, res) {
  try {
    const contactos = await sql`
      SELECT * FROM contactos ORDER BY fecha DESC
    `;
    res.json(contactos);
  } catch (err) {
    console.error('Error al obtener contactos:', err);
    res.status(500).json({ error: 'Error al obtener los contactos' });
  }
}

module.exports = { postContacto, getContactos };