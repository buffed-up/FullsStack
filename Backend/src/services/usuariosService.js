const bcrypt = require('bcryptjs');
const usuariosModel = require('../models/usuariosModel');

const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
const SALT_ROUNDS = 10;

function validarDominioCorreo(correo) {
  const correoMin = correo.toLowerCase();
  return DOMINIOS_PERMITIDOS.some(d => correoMin.endsWith(d));
}

// Quita la clave de un objeto usuario antes de devolverlo
function sinClave(usuario) {
  if (!usuario) return usuario;
  const { clave, ...resto } = usuario;
  return resto;
}

async function listarUsuarios() {
  return await usuariosModel.findAll();
}

async function obtenerUsuario(id) {
  return await usuariosModel.findById(id);
}

async function buscarPorCorreo(correo) {
  return await usuariosModel.findByCorreo(correo);
}

async function crearUsuario(datos) {
  if (!datos.run || !datos.nombre || !datos.apellido || !datos.correo || !datos.clave) {
    const error = new Error('run, nombre, apellido, correo y clave son obligatorios');
    error.status = 400;
    throw error;
  }
  if (!validarDominioCorreo(datos.correo)) {
    const error = new Error('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
    error.status = 400;
    throw error;
  }

  // Hashear la clave antes de guardarla
  const claveHasheada = await bcrypt.hash(datos.clave, SALT_ROUNDS);

  const creado = await usuariosModel.insert({
    ...datos,
    clave: claveHasheada
  });

  return sinClave(creado);
}

async function actualizarUsuario(id, datos) {
  if (!validarDominioCorreo(datos.correo)) {
    const error = new Error('Dominio de correo no autorizado');
    error.status = 400;
    throw error;
  }

  // Si viene clave, hashearla antes de guardar. Si viene vacía, ignorarla.
  let datosFinales = datos;
  if (datos.clave && datos.clave.trim() !== '') {
    datosFinales = {
      ...datos,
      clave: await bcrypt.hash(datos.clave, SALT_ROUNDS)
    };
  } else {
    // Eliminar la clave vacía para no pisarla
    const { clave, ...resto } = datos;
    datosFinales = resto;
  }

  const actualizado = await usuariosModel.update(id, datosFinales);
  return sinClave(actualizado);
}

async function eliminarUsuario(id) {
  return await usuariosModel.remove(id);
}

async function login(correo, clave) {
  if (!correo || !clave) {
    const error = new Error('correo y clave son obligatorios');
    error.status = 400;
    throw error;
  }
  if (!validarDominioCorreo(correo)) {
    const error = new Error('Dominio de correo no autorizado');
    error.status = 400;
    throw error;
  }

  const usuario = await usuariosModel.findByCorreoConClave(correo);
  if (!usuario) {
    const error = new Error('Correo o contraseña incorrectos');
    error.status = 401;
    throw error;
  }

  const coincide = await bcrypt.compare(clave, usuario.clave);
  if (!coincide) {
    const error = new Error('Correo o contraseña incorrectos');
    error.status = 401;
    throw error;
  }

  return sinClave(usuario);
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  buscarPorCorreo,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login
};