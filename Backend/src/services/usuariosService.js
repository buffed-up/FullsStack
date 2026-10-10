const usuariosModel = require('../models/usuariosModel');

const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

function validarDominioCorreo(correo) {
  const correoMin = correo.toLowerCase();
  return DOMINIOS_PERMITIDOS.some(d => correoMin.endsWith(d));
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

  return await usuariosModel.insert(datos);
}

async function actualizarUsuario(id, datos) {
  if (!validarDominioCorreo(datos.correo)) {
    const error = new Error('Dominio de correo no autorizado');
    error.status = 400;
    throw error;
  }
  return await usuariosModel.update(id, datos);
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

  const usuario = await usuariosModel.findByCorreo(correo);
  if (!usuario || usuario.clave !== clave) {
    const error = new Error('Correo o contraseña incorrectos');
    error.status = 401;
    throw error;
  }

  // Devolvemos el usuario sin la clave
  const { clave: _, ...usuarioSinClave } = usuario;
  return usuarioSinClave;
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