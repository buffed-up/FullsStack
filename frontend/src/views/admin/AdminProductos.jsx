import { useState, useEffect } from 'react'
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../../services/api'

const TABS = ['Listar', 'Nuevo', 'Editar']

const FORM_VACIO = {
  titulo: '',
  precio: '',
  img: '',
  descripcion: '',
  categoria_id: '',
  coleccion: '',
  es_portada: false,
  destacado: false,
  orden_destacado: ''
}

function AdminProductos() {
  const [tab, setTab] = useState('Listar')
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const limpiar = () => {
    setForm(FORM_VACIO)
    setEditandoId(null)
  }

  const handleCrear = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await crearProducto({
        ...form,
        precio: Number(form.precio),
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        orden_destacado: form.orden_destacado ? Number(form.orden_destacado) : null
      })
      limpiar()
      await cargar()
      setTab('Listar')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleActualizar = async (e) => {
    e.preventDefault()
    if (!editandoId) return
    setError('')
    try {
      await actualizarProducto(editandoId, {
        ...form,
        precio: Number(form.precio),
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        orden_destacado: form.orden_destacado ? Number(form.orden_destacado) : null
      })
      limpiar()
      await cargar()
      setTab('Listar')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleEditar = (p) => {
    setForm({
      titulo: p.titulo || '',
      precio: p.precio ?? '',
      img: p.img || '',
      descripcion: p.descripcion || '',
      categoria_id: p.categoria_id ?? '',
      coleccion: p.coleccion || '',
      es_portada: !!p.es_portada,
      destacado: !!p.destacado,
      orden_destacado: p.orden_destacado ?? ''
    })
    setEditandoId(p.id)
    setTab('Editar')
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await eliminarProducto(id)
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const formFields = (
    <form onSubmit={editandoId ? handleActualizar : handleCrear}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Título</label>
          <input name="titulo" className="form-control" value={form.titulo} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Precio</label>
          <input name="precio" type="number" className="form-control" value={form.precio} onChange={handleChange} required />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Imagen (URL o ruta)</label>
        <input name="img" className="form-control" value={form.img} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea name="descripcion" className="form-control" rows="3" value={form.descripcion} onChange={handleChange} />
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Categoría ID</label>
          <input name="categoria_id" type="number" className="form-control" value={form.categoria_id} onChange={handleChange} />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Colección</label>
          <input name="coleccion" className="form-control" value={form.coleccion} onChange={handleChange} />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Orden destacado</label>
          <input name="orden_destacado" type="number" className="form-control" value={form.orden_destacado} onChange={handleChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="me-3">
          <input type="checkbox" name="es_portada" checked={form.es_portada} onChange={handleChange} /> Es portada
        </label>
        <label>
          <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} /> Destacado
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        {editandoId ? 'Actualizar' : 'Crear'}
      </button>
      {editandoId && (
        <button type="button" className="btn btn-secondary ms-2" onClick={limpiar}>
          Cancelar
        </button>
      )}
    </form>
  )

  return (
    <>
      <h2 style={{ color: 'var(--vw-cyan)' }}>Productos</h2>

      <ul className="nav nav-tabs mb-3">
        {TABS.map(t => (
          <li className="nav-item" key={t}>
            <button className={tab === t ? 'nav-link active' : 'nav-link'} onClick={() => setTab(t)} type="button">
              {t}
            </button>
          </li>
        ))}
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}

      {tab === 'Listar' && (
        <>
          {cargando ? <p>Cargando...</p> : (
            <div className="table-responsive">
              <table className="table tabla-vaporwave">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Img</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Colección</th>
                    <th>Destacado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.img && <img src={p.img} alt={p.titulo} className="img-items" />}</td>
                      <td>{p.titulo}</td>
                      <td>${p.precio}</td>
                      <td>{p.coleccion || '—'}</td>
                      <td>{p.destacado ? 'Sí' : 'No'}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(p)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(p.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'Nuevo' && (
        <>
          {formFields}
        </>
      )}

      {tab === 'Editar' && (
        <>
          {editandoId
            ? formFields
            : <p>Selecciona un producto en la pestaña <strong>Listar</strong> y haz clic en Editar.</p>}
        </>
      )}
    </>
  )
}

export default AdminProductos