import { useState, useEffect } from 'react'
import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../../services/api'

const TABS = ['Listar', 'Nuevo', 'Editar']

const FORM_VACIO = {
  run: '',
  nombre: '',
  apellido: '',
  correo: '',
  clave: '',
  fechaNacimiento: '',
  rol: 'cliente',
  region: '',
  comuna: '',
  direccion: ''
}

function AdminUsuarios() {
  const [tab, setTab] = useState('Listar')
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const data = await getUsuarios()
      setUsuarios(data)
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
      await crearUsuario(form)
      setExito('Usuario creado.')
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
      // Solo mandamos clave si el admin escribió una nueva
      const payload = { ...form }
      if (!payload.clave || payload.clave.trim() === '') {
        delete payload.clave
      }
      await actualizarUsuario(editandoId, payload)
      setExito('Usuario actualizado.')
      limpiar()
      await cargar()
      setTab('Listar')
    } catch (e) {
      setError(e.message)
    }
  }

  const handleEditar = (u) => {
    setForm({
      run: u.run || '',
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      correo: u.correo || '',
      clave: '', // se deja vacía, opcional
      fechaNacimiento: u.fecha_nacimiento ? u.fecha_nacimiento.substring(0, 10) : '',
      rol: u.rol || 'cliente',
      region: u.region || '',
      comuna: u.comuna || '',
      direccion: u.direccion || ''
    })
    setEditandoId(u.id)
    setError('')
    setExito('')
    setTab('Editar')
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    setError('')
    setExito('')
    try {
      await eliminarUsuario(id)
      setExito('Usuario eliminado.')
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const formFields = (
    <form onSubmit={editandoId ? handleActualizar : handleCrear}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">RUN</label>
          <input name="run" className="form-control" value={form.run} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input type="date" name="fechaNacimiento" className="form-control" value={form.fechaNacimiento} onChange={handleChange} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre</label>
          <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Apellido</label>
          <input name="apellido" className="form-control" value={form.apellido} onChange={handleChange} required />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input type="email" name="correo" className="form-control" value={form.correo} onChange={handleChange} required />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Contraseña {editandoId ? '(dejar en blanco para no cambiar)' : ''}
          </label>
          <input
            type="password"
            name="clave"
            className="form-control"
            value={form.clave}
            onChange={handleChange}
            required={!editandoId}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Rol</label>
          <select name="rol" className="form-select" value={form.rol} onChange={handleChange}>
            <option value="cliente">cliente</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Región</label>
          <input name="region" className="form-control" value={form.region} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Comuna</label>
          <input name="comuna" className="form-control" value={form.comuna} onChange={handleChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Dirección</label>
        <input name="direccion" className="form-control" value={form.direccion} onChange={handleChange} />
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
      <h2 style={{ color: 'var(--vw-cyan)' }}>Usuarios</h2>

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
                    <th>RUN</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Región</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.run}</td>
                      <td>{u.nombre} {u.apellido}</td>
                      <td>{u.correo}</td>
                      <td>{u.rol}</td>
                      <td>{u.region || '—'}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(u)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(u.id)}>Eliminar</button>
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
          : <p>Selecciona un usuario en la pestaña <strong>Listar</strong> y haz clic en Editar.</p>
      )}
    </>
  )
}

export default AdminUsuarios