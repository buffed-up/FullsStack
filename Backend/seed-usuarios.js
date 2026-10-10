const bcrypt = require('bcryptjs');
const { sql } = require('./src/config/database');

const SALT_ROUNDS = 10;

const usuarios = [
  {
    run: '11111111-1',
    nombre: 'Admin',
    apellido: 'Boosted',
    correo: 'admin@gmail.com',
    fechaNacimiento: '1990-01-01',
    rol: 'admin',
    region: 'Metropolitana',
    comuna: 'Santiago',
    direccion: 'Av. Siempre Viva 123',
    clave: 'admin123'
  },
  {
    run: '22222222-2',
    nombre: 'Cliente',
    apellido: 'Prueba',
    correo: 'cliente@gmail.com',
    fechaNacimiento: '1995-05-05',
    rol: 'cliente',
    region: 'Valparaíso',
    comuna: 'Viña del Mar',
    direccion: 'Calle Falsa 456',
    clave: 'cliente123'
  }
];

async function seed() {
  try {
    for (const u of usuarios) {
      const hash = await bcrypt.hash(u.clave, SALT_ROUNDS);
      await sql`
        INSERT INTO usuarios (run, nombre, apellido, correo, fecha_nacimiento, rol, region, comuna, direccion, clave)
        VALUES (${u.run}, ${u.nombre}, ${u.apellido}, ${u.correo}, ${u.fechaNacimiento},
                ${u.rol}, ${u.region}, ${u.comuna}, ${u.direccion}, ${hash})
        ON CONFLICT (correo) DO NOTHING
      `;
      console.log(`✓ ${u.correo} creado`);
    }
    console.log('Listo.');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    process.exit(0);
  }
}

seed();