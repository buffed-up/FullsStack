import React, { useState, useEffect } from 'react'
import {
  getProductos,
  getCategorias,
  getReportes,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagen
} from '../../services/api'

const TABS = ['Listar', 'Nuevo', 'Editar']

const FORM_VACIO = {
  titulo: '',
  precio: '',
  img: '',
  descripcion: '',
  categoria_id: '',
  coleccion: '',
  stock: 0
}

function AdminProductos() {
  const [tab, setTab] = useState('Listar')
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [vendidos, setVendidos] = useState({})
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const [prods, cats, reportes] = await Promise.all([
        getProductos(),
        getCategorias(),
        getReportes()
      ])
      setProductos(prods)
      setCategorias(cats)

      const mapa = {}
      reportes.productosMasVendidos?.forEach(p => {
        mapa[p.producto_id] = p.total_vendido
      })
      setVendidos(mapa)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const limpiar = () => {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setError('')
    setExito('')
  }

  const handleCrear = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    try {
      await crearProducto({
        ...form,
        precio: Number(form.precio),
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        stock: Number(form.stock) || 0
      })
      setExito('Producto creado.')
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
    setExito('')
    try {
      await actualizarProducto(editandoId, {
        ...form,
        precio: Number(form.precio),
        categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
        stock: Number(form.stock) || 0
      })
      setExito('Producto actualizado.')
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
      stock: p.stock ?? 0
    })
    setEditandoId(p.id)
    setError('')
    setExito('')
    setTab('Editar')
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    setError('')
    setExito('')
    try {
      await eliminarProducto(id)
      setExito('Producto eliminado.')
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const nombreCategoria = (id) => {
    const c = categorias.find(c => c.id === id)
    return c ? c.nombre : (id ? `#${id}` : '—')
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
        <label className="form-label">Imagen</label>
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
              setExito('Imagen subida.')
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
        <label className="form-label">Descripción</label>
        <textarea name="descripcion" className="form-control" rows="3" value={form.descripcion} onChange={handleChange} />
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Categoría</label>
          <select name="categoria_id" className="form-select" value={form.categoria_id} onChange={handleChange}>
            <option value="">— Sin categoría —</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Colección</label>
          <input name="coleccion" className="form-control" value={form.coleccion} onChange={handleChange} />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Stock</label>
          <input name="stock" type="number" min="0" className="form-control" value={form.stock} onChange={handleChange} />
        </div>
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
      {exito && <div className="alert alert-success">{exito}</div>}

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
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Vendidos</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        {p.img && (
                          <img src={p.img} alt={p.titulo} className="img-items" />
                        )}
                      </td>
                      <td>{p.titulo}</td>
                      <td>${p.precio}</td>
                      <td>{nombreCategoria(p.categoria_id)}</td>
                      <td style={{ color: p.stock <= 5 ? 'var(--vw-pink)' : undefined, fontWeight: p.stock <= 5 ? 'bold' : 'normal' }}>
                        {p.stock ?? 0}
                      </td>
                      <td>{vendidos[p.id] || 0}</td>
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

      {tab === 'Nuevo' && formFields}

      {tab === 'Editar' && (
        editandoId
          ? formFields
          : <p>Selecciona un producto en la pestaña <strong>Listar</strong> y haz clic en Editar.</p>
      )}
    </>
  )
}

export default AdminProductos