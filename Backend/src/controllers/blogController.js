const blogService = require('../services/blogService');

// Extrae usuario del body o headers (sin auth real)
function usuarioDesdeReq(req) {
  const id = req.body?.usuario_id || req.headers['x-usuario-id'];
  const rol = req.body?.usuario_rol || req.headers['x-usuario-rol'];
  return { id: Number(id) || null, rol: rol || 'cliente' };
}

async function getBlogs(req, res) {
  try {
    const blogs = await blogService.listarBlogs();
    res.json(blogs);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function getBlog(req, res) {
  try {
    const blog = await blogService.obtenerBlog(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog no encontrado' });
    res.json(blog);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function postBlog(req, res) {
  try {
    const usuario = usuarioDesdeReq(req);
    if (!usuario.id) {
      return res.status(400).json({ error: 'usuario_id es obligatorio' });
    }
    const nuevo = await blogService.crearBlog({
      ...req.body,
      usuario_id: usuario.id
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function putBlog(req, res) {
  try {
    const usuario = usuarioDesdeReq(req);
    if (!usuario.id) {
      return res.status(400).json({ error: 'usuario_id es obligatorio' });
    }
    const actualizado = await blogService.actualizarBlog(req.params.id, req.body, usuario);
    res.json(actualizado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function deleteBlog(req, res) {
  try {
    const usuario = usuarioDesdeReq(req);
    if (!usuario.id) {
      return res.status(400).json({ error: 'usuario_id es obligatorio' });
    }
    await blogService.eliminarBlog(req.params.id, usuario);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function postComentario(req, res) {
  try {
    const usuario = usuarioDesdeReq(req);
    if (!usuario.id) {
      return res.status(400).json({ error: 'usuario_id es obligatorio' });
    }
    const nuevo = await blogService.crearComentario(req.params.id, {
      ...req.body,
      usuario_id: usuario.id
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function deleteComentario(req, res) {
  try {
    const usuario = usuarioDesdeReq(req);
    if (!usuario.id) {
      return res.status(400).json({ error: 'usuario_id es obligatorio' });
    }
    await blogService.eliminarComentario(req.params.id, usuario);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = {
  getBlogs,
  getBlog,
  postBlog,
  putBlog,
  deleteBlog,
  postComentario,
  deleteComentario
};