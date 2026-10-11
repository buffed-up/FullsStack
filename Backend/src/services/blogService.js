const blogModel = require('../models/blogModel');

async function listarBlogs() {
  return await blogModel.findAll();
}

async function obtenerBlog(id) {
  return await blogModel.findById(id);
}

async function crearBlog(datos) {
  if (!datos.titulo || !datos.contenido) {
    const error = new Error('titulo y contenido son obligatorios');
    error.status = 400;
    throw error;
  }
  return await blogModel.insert({
    usuario_id: datos.usuario_id,
    titulo: datos.titulo,
    resumen: datos.resumen || null,
    contenido: datos.contenido,
    img: datos.img || null,
    categoria: datos.categoria || null
  });
}

async function actualizarBlog(id, datos, usuario) {
  const blog = await blogModel.findById(id);
  if (!blog) {
    const error = new Error('Blog no encontrado');
    error.status = 404;
    throw error;
  }
  // Solo autor o admin
  if (usuario.rol !== 'admin' && blog.usuario_id !== usuario.id) {
    const error = new Error('No autorizado');
    error.status = 403;
    throw error;
  }
  if (!datos.titulo || !datos.contenido) {
    const error = new Error('titulo y contenido son obligatorios');
    error.status = 400;
    throw error;
  }
  return await blogModel.update(id, {
    titulo: datos.titulo,
    resumen: datos.resumen || null,
    contenido: datos.contenido,
    img: datos.img || null,
    categoria: datos.categoria || null
  });
}

async function eliminarBlog(id, usuario) {
  const blog = await blogModel.findById(id);
  if (!blog) {
    const error = new Error('Blog no encontrado');
    error.status = 404;
    throw error;
  }
  if (usuario.rol !== 'admin' && blog.usuario_id !== usuario.id) {
    const error = new Error('No autorizado');
    error.status = 403;
    throw error;
  }
  return await blogModel.remove(id);
}

async function crearComentario(blogId, datos) {
  if (!datos.comentario || !datos.comentario.trim()) {
    const error = new Error('El comentario no puede estar vacío');
    error.status = 400;
    throw error;
  }
  const blog = await blogModel.findById(blogId);
  if (!blog) {
    const error = new Error('Blog no encontrado');
    error.status = 404;
    throw error;
  }
  // Si viene comentario_padre_id, verificar que exista y sea del mismo blog
  if (datos.comentario_padre_id) {
    const padre = await blogModel.findComentarioById(datos.comentario_padre_id);
    if (!padre || padre.blog_id !== Number(blogId)) {
      const error = new Error('Comentario padre inválido');
      error.status = 400;
      throw error;
    }
  }
  return await blogModel.insertComentario({
    blog_id: Number(blogId),
    usuario_id: datos.usuario_id,
    comentario: datos.comentario,
    comentario_padre_id: datos.comentario_padre_id || null
  });
}

async function eliminarComentario(comentarioId, usuario) {
  const comentario = await blogModel.findComentarioById(comentarioId);
  if (!comentario) {
    const error = new Error('Comentario no encontrado');
    error.status = 404;
    throw error;
  }
  // Admin: siempre. Otros: no permitido (nadie borra comentarios ajenos salvo admin)
  if (usuario.rol !== 'admin') {
    const error = new Error('No autorizado');
    error.status = 403;
    throw error;
  }
  return await blogModel.removeComentario(comentarioId);
}

module.exports = {
  listarBlogs,
  obtenerBlog,
  crearBlog,
  actualizarBlog,
  eliminarBlog,
  crearComentario,
  eliminarComentario
};