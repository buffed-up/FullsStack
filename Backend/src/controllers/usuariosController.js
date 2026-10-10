const usuariosService = require('../services/usuariosService');

async function getUsuarios(req, res) {
  try {
    const usuarios = await usuariosService.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getUsuario(req, res) {
  try {
    const usuario = await usuariosService.obtenerUsuario(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function postUsuario(req, res) {
  try {
    const nuevo = await usuariosService.crearUsuario(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function putUsuario(req, res) {
  try {
    const actualizado = await usuariosService.actualizarUsuario(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function deleteUsuario(req, res) {
  try {
    await usuariosService.eliminarUsuario(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { correo, clave } = req.body;
    const usuario = await usuariosService.login(correo, clave);
    res.json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = { getUsuarios, getUsuario, postUsuario, putUsuario, deleteUsuario, login };