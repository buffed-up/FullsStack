const categoriasModel = require('../models/categoriasModel');

async function listarCategorias() {
  return await categoriasModel.findAll();
}

async function obtenerCategoria(id) {
  return await categoriasModel.findById(id);
}

async function crearCategoria(datos) {
  if (!datos.nombre || !datos.nombre.trim()) {
    const error = new Error('El nombre es obligatorio');
    error.status = 400;
    throw error;
  }

  try {
    return await categoriasModel.insert({ nombre: datos.nombre.trim() });
  } catch (e) {
    // 23505 = unique_violation en Postgres
    if (e.code === '23505') {
      const error = new Error('Ya existe una categoría con ese nombre');
      error.status = 400;
      throw error;
    }
    throw e;
  }
}

async function actualizarCategoria(id, datos) {
  if (!datos.nombre || !datos.nombre.trim()) {
    const error = new Error('El nombre es obligatorio');
    error.status = 400;
    throw error;
  }

  try {
    return await categoriasModel.update(id, { nombre: datos.nombre.trim() });
  } catch (e) {
    if (e.code === '23505') {
      const error = new Error('Ya existe una categoría con ese nombre');
      error.status = 400;
      throw error;
    }
    throw e;
  }
}

async function eliminarCategoria(id) {
  try {
    return await categoriasModel.remove(id);
  } catch (e) {
    // 23503 = foreign_key_violation: hay productos apuntando a esta categoría
    if (e.code === '23503') {
      const error = new Error('No se puede eliminar: hay productos asociados a esta categoría');
      error.status = 400;
      throw error;
    }
    throw e;
  }
}

module.exports = {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};