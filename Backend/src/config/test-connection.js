const { sql } = require('./database');

async function probar() {
  try {
    const resultado = await sql`SELECT version()`;
    console.log('Conexión exitosa.');
    console.log(resultado[0].version);
  } catch (error) {
    console.error('Error al conectar:', error.message);
  }
}

probar();