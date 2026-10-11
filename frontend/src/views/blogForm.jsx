import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBlog, crearBlog, actualizarBlog, subirImagen } from '../services/api'
import { useAuth } from '../context/AuthContext'

function BlogForm() {
  const { id } = useParams()
  const editando = !!id
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [form, setForm] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    img: '',
    categoria: ''
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(editando)

  useEffect(() => {
    if (!usuario) {
      navigate('/login')
      return
    }
    if (!editando) return
    getBlog(id)
      .then(data => {
        setForm({
          titulo: data.titulo || '',
          resumen: data.resumen || '',
          contenido: data.contenido || '',
          img: data.img || '',
          categoria: data.categoria || ''
        })
      })
      .catch(e => setError(e.message))
      .finally(() => setCargandoDatos(false))
  }, [id, editando, usuario, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const payload = { ...form, usuario_id: usuario.id, usuario_rol: usuario.rol }
      if (editando) {
        await actualizarBlog(id, payload)
      } else {
        await crearBlog(payload)
      }
      navigate('/blogs')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  if (cargandoDatos) return <div className="container my-5"><p>Cargando...</p></div>

  return (
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <h2 style={{ color: 'var(--vw-cyan)' }}>{editando ? 'Editar blog' : 'Nuevo blog'}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input name="titulo" className="form-control" value={form.titulo} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Resumen (opcional, se muestra en la card)</label>
          <textarea name="resumen" className="form-control" rows="2" value={form.resumen} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Contenido</label>
          <textarea name="contenido" className="form-control" rows="8" value={form.contenido} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen (opcional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={async (e) => {
              const archivo = e.target.files?.[0]
              if (!archivo) return
              try {
                const { url } = await subirImagen(archivo)
                setForm({ ...form, img: url })
              } catch (err) {
                setError(err.message)
              }
            }}
          />
          {form.img && (
            <div className="mt-2">
              <img
                src={form.img.startsWith('http') ? form.img : `http://localhost:3000${form.img}`}
                alt="preview"
                style={{ maxWidth: '200px', maxHeight: '120px', objectFit: 'contain', background: '#000', padding: '4px' }}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría (opcional)</label>
          <input name="categoria" className="form-control" value={form.categoria} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? 'Guardando...' : (editando ? 'Actualizar' : 'Crear')}
        </button>
      </form>
    </div>
  )
}

export default BlogForm