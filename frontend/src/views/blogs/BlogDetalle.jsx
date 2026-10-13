import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  getBlog,
  eliminarBlog,
  crearComentario,
  eliminarComentario
} from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function ComentarioItem({ comentario, respuestas, onResponder, usuario, onEliminar, blogAutorId }) {
  const [respondiendo, setRespondiendo] = useState(false)
  const [texto, setTexto] = useState('')

  const enviarRespuesta = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    await onResponder(comentario.id, texto)
    setTexto('')
    setRespondiendo(false)
  }

  const puedeEliminar =
    usuario && (usuario.rol === 'admin' || usuario.id === comentario.usuario_id)

  return (
    <div className="vapor-card p-3 mb-3">
      <div className="d-flex justify-content-between">
        <strong style={{ color: 'var(--vw-cyan)' }}>
          {comentario.autor_nombre} {comentario.autor_apellido}
        </strong>
        <small style={{ color: '#ffffff', opacity: 0.7 }}>
          {comentario.fecha ? new Date(comentario.fecha).toLocaleString('es-CL') : ''}
        </small>
      </div>
      <p style={{ marginTop: '0.5rem', color: '#ffffff' }}>{comentario.comentario}</p>

      <div className="d-flex gap-2">
        {usuario && (
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setRespondiendo(!respondiendo)}
          >
            Responder
          </button>
        )}
        {puedeEliminar && (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onEliminar(comentario.id)}
          >
            Eliminar
          </button>
        )}
      </div>

      {respondiendo && (
        <form onSubmit={enviarRespuesta} className="mt-2">
          <textarea
            className="form-control mb-2"
            rows="2"
            placeholder="Escribe tu respuesta..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-primary">Enviar respuesta</button>
        </form>
      )}

      {respuestas.length > 0 && (
        <div style={{ marginLeft: '2rem', marginTop: '1rem' }}>
          {respuestas.map(r => (
            <ComentarioItem
              key={r.id}
              comentario={r}
              respuestas={[]}
              onResponder={onResponder}
              usuario={usuario}
              onEliminar={onEliminar}
              blogAutorId={blogAutorId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BlogDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [blog, setBlog] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [comentarioTexto, setComentarioTexto] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const data = await getBlog(id)
      setBlog(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [id])

  const enviarComentario = async (e) => {
    e.preventDefault()
    if (!usuario) {
      navigate('/login')
      return
    }
    if (!comentarioTexto.trim()) return
    setEnviando(true)
    try {
      await crearComentario(id, {
        usuario_id: usuario.id,
        comentario: comentarioTexto
      })
      setComentarioTexto('')
      await cargar()
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  const responder = async (padreId, texto) => {
    if (!usuario) {
      navigate('/login')
      return
    }
    try {
      await crearComentario(id, {
        usuario_id: usuario.id,
        comentario: texto,
        comentario_padre_id: padreId
      })
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const borrarComentario = async (comentarioId) => {
    if (!usuario) return
    if (!confirm('¿Eliminar este comentario?')) return
    try {
      await eliminarComentario(comentarioId, usuario)
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const borrarBlog = async () => {
    if (!usuario) return
    if (!confirm('¿Eliminar este blog completo?')) return
    try {
      await eliminarBlog(id, usuario)
      navigate('/blogs')
    } catch (e) {
      setError(e.message)
    }
  }

  if (cargando) return <div className="container my-5"><p style={{ color: '#ffffff' }}>Cargando...</p></div>
  if (error && !blog) return <div className="container my-5"><div className="alert alert-danger">{error}</div></div>
  if (!blog) return <div className="container my-5"><p style={{ color: '#ffffff' }}>Blog no encontrado.</p></div>

  const puedeEditar =
    usuario && (usuario.rol === 'admin' || usuario.id === blog.usuario_id)

  // Separar comentarios raíz y respuestas
  const comentariosRaiz = blog.comentarios?.filter(c => !c.comentario_padre_id) || []
  const respuestasPorPadre = {}
  blog.comentarios?.forEach(c => {
    if (c.comentario_padre_id) {
      if (!respuestasPorPadre[c.comentario_padre_id]) respuestasPorPadre[c.comentario_padre_id] = []
      respuestasPorPadre[c.comentario_padre_id].push(c)
    }
  })

  return (
    <div className="container my-5">
      <Link to="/blogs" className="btn btn-secondary mb-3">← Volver a blogs</Link>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="vapor-card p-4 mb-4">
        <h1 style={{ color: 'var(--vw-pink)' }}>{blog.titulo}</h1>
        <p style={{ color: '#ffffff', opacity: 0.85 }}>
          Por {blog.autor_nombre} {blog.autor_apellido} · {new Date(blog.fecha).toLocaleDateString('es-CL')}
          {blog.categoria ? ` · ${blog.categoria}` : ''}
        </p>

        {blog.img && (
          <img
            src={blog.img}
            alt={blog.titulo}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', marginBottom: '1.5rem' }}
          />
        )}

        <p style={{ whiteSpace: 'pre-wrap', color: '#ffffff', fontSize: '1.15rem', lineHeight: '1.8' }}>
          {blog.contenido}
        </p>

        {puedeEditar && (
          <div className="mt-4 d-flex gap-2">
            <Link to={`/blogs/${blog.id}/editar`} className="btn btn-warning">Editar</Link>
            <button className="btn btn-danger" onClick={borrarBlog}>Eliminar blog</button>
          </div>
        )}
      </div>

      <h3 style={{ color: 'var(--vw-cyan)' }}>
        Comentarios ({blog.comentarios?.length || 0})
      </h3>

      {usuario ? (
        <form onSubmit={enviarComentario} className="mb-4">
          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Escribe un comentario..."
            value={comentarioTexto}
            onChange={(e) => setComentarioTexto(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Comentar'}
          </button>
        </form>
      ) : (
        <div className="alert alert-info">
          <Link to="/login">Inicia sesión</Link> para comentar.
        </div>
      )}

      {comentariosRaiz.length === 0 ? (
        <p className="texto-blanco-chico">Aún no hay comentarios.</p>
      ) : (
        comentariosRaiz.map(c => (
          <ComentarioItem
            key={c.id}
            comentario={c}
            respuestas={respuestasPorPadre[c.id] || []}
            onResponder={responder}
            usuario={usuario}
            onEliminar={borrarComentario}
            blogAutorId={blog.usuario_id}
          />
        ))
      )}
    </div>
  )
}

export default BlogDetalle