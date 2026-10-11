const BASE_URL = 'http://localhost:3000/api';
const BACKEND_ORIGIN = 'http://localhost:3000';

function normalizarImg(item) {
  if (!item || !item.img) return item;
  if (item.img.startsWith('http')) return item;
  if (item.img.startsWith('/')) {
    return { ...item, img: `${BACKEND_ORIGIN}${item.img}` };
  }
  return { ...item, img: `${BACKEND_ORIGIN}/${item.img}` };
}

function normalizarImgs(lista) {
  if (!Array.isArray(lista)) return lista;
  return lista.map(normalizarImg);
}

function normalizarOrden(orden) {
  if (!orden || !Array.isArray(orden.items)) return orden;
  return { ...orden, items: orden.items.map(normalizarImg) };
}

export async function getProductos() {
  const res = await fetch(`${BASE_URL}/productos`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return normalizarImgs(await res.json());
}

export async function getProducto(id) {
  const res = await fetch(`${BASE_URL}/productos/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  return normalizarImg(await res.json());
}

export async function crearProducto(datos) {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al crear producto');
  return normalizarImg(await res.json());
}

export async function actualizarProducto(id, datos) {
  const res = await fetch(`${BASE_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  return normalizarImg(await res.json());
}

export async function eliminarProducto(id) {
  const res = await fetch(`${BASE_URL}/productos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar producto');
}

export async function getUsuarios() {
  const res = await fetch(`${BASE_URL}/usuarios`);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}

export async function getUsuario(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`);
  if (!res.ok) throw new Error('Usuario no encontrado');
  return res.json();
}

export async function crearUsuario(datos) {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al crear usuario');
  }
  return res.json();
}

export async function actualizarUsuario(id, datos) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al actualizar usuario');
  }
  return res.json();
}

export async function eliminarUsuario(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar usuario');
}

export async function login(correo, clave) {
  const res = await fetch(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, clave })
  });
  if (!res.ok) throw new Error('Correo o contraseña incorrectos');
  return res.json();
}

export async function getColecciones() {
  const res = await fetch(`${BASE_URL}/productos/colecciones`);
  if (!res.ok) throw new Error('Error al obtener colecciones');
  return res.json();
}

export async function getDestacados() {
  const res = await fetch(`${BASE_URL}/productos/destacados`);
  if (!res.ok) throw new Error('Error al obtener destacados');
  return normalizarImgs(await res.json());
}

export async function getProductosPorColeccion(nombre) {
  const res = await fetch(`${BASE_URL}/productos?coleccion=${encodeURIComponent(nombre)}`);
  if (!res.ok) throw new Error('Error al obtener productos de la colección');
  return normalizarImgs(await res.json());
}

export async function getCategorias() {
  const res = await fetch(`${BASE_URL}/categorias`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
}

export async function getCategoria(id) {
  const res = await fetch(`${BASE_URL}/categorias/${id}`);
  if (!res.ok) throw new Error('Categoría no encontrada');
  return res.json();
}

export async function crearCategoria(datos) {
  const res = await fetch(`${BASE_URL}/categorias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al crear categoría');
  }
  return res.json();
}

export async function actualizarCategoria(id, datos) {
  const res = await fetch(`${BASE_URL}/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al actualizar categoría');
  }
  return res.json();
}

export async function eliminarCategoria(id) {
  const res = await fetch(`${BASE_URL}/categorias/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al eliminar categoría');
  }
}

export async function getOrdenes() {
  const res = await fetch(`${BASE_URL}/ordenes`);
  if (!res.ok) throw new Error('Error al obtener boletas');
  return res.json();
}

export async function getOrden(id) {
  const res = await fetch(`${BASE_URL}/ordenes/${id}`);
  if (!res.ok) throw new Error('Boleta no encontrada');
  return normalizarOrden(await res.json());
}

export async function getOrdenesDeUsuario(usuarioId) {
  const res = await fetch(`${BASE_URL}/ordenes/usuario/${usuarioId}`);
  if (!res.ok) throw new Error('Error al obtener historial');
  return res.json();
}

export async function crearOrden(datos) {
  const res = await fetch(`${BASE_URL}/ordenes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al crear la boleta');
  }
  return normalizarOrden(await res.json());
}

export async function actualizarEstadoOrden(id, estado) {
  const res = await fetch(`${BASE_URL}/ordenes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado })
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al actualizar estado');
  }
  return res.json();
}

export async function getReportes() {
  const res = await fetch(`${BASE_URL}/reportes`);
  if (!res.ok) throw new Error('Error al obtener reportes');
  return res.json();
}

export async function subirImagen(archivo) {
  const formData = new FormData();
  formData.append('archivo', archivo);
  const res = await fetch(`${BASE_URL}/uploads`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al subir imagen');
  }
  return res.json();
}

/* ============================================================
   BLOGS
   ============================================================ */

function normalizarBlog(b) {
  if (!b || !b.img) return b;
  return normalizarImg(b);
}

function normalizarBlogs(lista) {
  if (!Array.isArray(lista)) return lista;
  return lista.map(normalizarBlog);
}

export async function getBlogs() {
  const res = await fetch(`${BASE_URL}/blogs`);
  if (!res.ok) throw new Error('Error al obtener blogs');
  return normalizarBlogs(await res.json());
}

export async function getBlog(id) {
  const res = await fetch(`${BASE_URL}/blogs/${id}`);
  if (!res.ok) throw new Error('Blog no encontrado');
  return normalizarBlog(await res.json());
}

export async function crearBlog(datos) {
  const res = await fetch(`${BASE_URL}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al crear blog');
  }
  return normalizarBlog(await res.json());
}

export async function actualizarBlog(id, datos) {
  const res = await fetch(`${BASE_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al actualizar blog');
  }
  return normalizarBlog(await res.json());
}

export async function eliminarBlog(id, usuario) {
  const res = await fetch(`${BASE_URL}/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-usuario-id': usuario.id,
      'x-usuario-rol': usuario.rol
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al eliminar blog');
  }
}

export async function crearComentario(blogId, datos) {
  const res = await fetch(`${BASE_URL}/blogs/${blogId}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al crear comentario');
  }
  return res.json();
}

export async function eliminarComentario(comentarioId, usuario) {
  const res = await fetch(`${BASE_URL}/blogs/comentarios/${comentarioId}`, {
    method: 'DELETE',
    headers: {
      'x-usuario-id': usuario.id,
      'x-usuario-rol': usuario.rol
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al eliminar comentario');
  }
}