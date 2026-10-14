import React, { useState, useEffect } from 'react'
import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../services/api'

const TABS = ['Listar', 'Nuevo', 'Editar']

const FORM_VACIO = { nombre: '' }

function AdminCategorias() {
  const [tab, setTab] = useState('Listar')
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const data = await getCategorias()
      setCategorias(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
      await crearCategoria(form)
      setExito('Categoría creada.')
      setForm(FORM_VACIO)
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
      await actualizarCategoria(editandoId, form)
      setExito('Categoría actualizada.')
      limpiar()
      await cargar()
      setTab('Listar')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleEditar = (c) => {
    setForm({ nombre: c.nombre || '' })
    setEditandoId(c.id)
    setError('')
    setExito('')
    setTab('Editar')
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    setError('')
    setExito('')
    try {
      await eliminarCategoria(id)
      setExito('Categoría eliminada.')
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const formFields = (
    <form onSubmit={editandoId ? handleActualizar : handleCrear}>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          name="nombre"
          className="form-control"
          value={form.nombre}
          onChange={handleChange}
          required
        />
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
      <h2 style={{ color: 'var(--vw-cyan)' }}>Categorías</h2>

      <ul className="nav nav-tabs mb-3">
        {TABS.map(t => (
          <li className="nav-item" key={t}>
            <button
              className={tab === t ? 'nav-link active' : 'nav-link'}
              onClick={() => setTab(t)}
              type="button"
            >
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
                    <th>Nombre</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.nombre}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditar(c)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleEliminar(c.id)}
                        >
                          Eliminar
                        </button>
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
          : <p>Selecciona una categoría en la pestaña <strong>Listar</strong> y haz clic en Editar.</p>
      )}
    </>
  )
}

export default AdminCategorias