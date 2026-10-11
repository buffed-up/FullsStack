import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { actualizarUsuario } from '../../services/api'

function AdminPerfil() {
  const { usuario, actualizarPerfil } = useAuth()

  const [editando, setEditando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)

  const [form, setForm] = useState({
    run: usuario.run || '',
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    correo: usuario.correo || '',
    clave: '',
    fechaNacimiento: usuario.fecha_nacimiento
      ? usuario.fecha_nacimiento.substring(0, 10)
      : '',
    rol: usuario.rol || 'admin',
    region: usuario.region || '',
    comuna: usuario.comuna || '',
    direccion: usuario.direccion || ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const iniciarEdicion = () => {
    // Reinicia el form con los datos actuales del usuario
    setForm({
      run: usuario.run || '',
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      correo: usuario.correo || '',
      clave: '',
      fechaNacimiento: usuario.fecha_nacimiento
        ? usuario.fecha_nacimiento.substring(0, 10)
        : '',
      rol: usuario.rol || 'admin',
      region: usuario.region || '',
      comuna: usuario.comuna || '',
      direccion: usuario.direccion || ''
    })
    setError('')
    setExito('')
    setEditando(true)
  }

  const cancelar = () => {
    setEditando(false)
    setError('')
    setExito('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')

    // Aviso si el rol cambia
    if (form.rol !== usuario.rol) {
      const confirmar = confirm(
        `Vas a cambiar tu rol de "${usuario.rol}" a "${form.rol}".\n\n` +
        (form.rol !== 'admin'
          ? '¡Perderás acceso al panel de administración inmediatamente después de guardar!'
          : 'Ganarás acceso al panel de administración.')
      )
      if (!confirmar) return
    }

    setGuardando(true)
    try {
      const payload = { ...form }
      if (!payload.clave || payload.clave.trim() === '') {
        delete payload.clave
      }

      const actualizado = await actualizarUsuario(usuario.id, payload)

      actualizarPerfil({
        run: actualizado.run,
        nombre: actualizado.nombre,
        apellido: actualizado.apellido,
        correo: actualizado.correo,
        fecha_nacimiento: actualizado.fecha_nacimiento,
        rol: actualizado.rol,
        region: actualizado.region,
        comuna: actualizado.comuna,
        direccion: actualizado.direccion
      })

      setExito('Perfil actualizado correctamente.')
      setEditando(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: 'var(--vw-cyan)', margin: 0 }}>Perfil</h2>
        {!editando && (
          <button className="btn btn-primary" onClick={iniciarEdicion}>
            Editar
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      {!editando && (
        /* ===== MODO VISTA ===== */
        <div className="vapor-card p-4">
          <dl className="row mb-0">
            <dt className="col-sm-3">RUN</dt>
            <dd className="col-sm-9">{usuario.run || '—'}</dd>

            <dt className="col-sm-3">Nombre</dt>
            <dd className="col-sm-9">{usuario.nombre} {usuario.apellido}</dd>

            <dt className="col-sm-3">Correo</dt>
            <dd className="col-sm-9">{usuario.correo}</dd>

            <dt className="col-sm-3">Fecha de nacimiento</dt>
            <dd className="col-sm-9">
              {usuario.fecha_nacimiento
                ? usuario.fecha_nacimiento.substring(0, 10)
                : '—'}
            </dd>

            <dt className="col-sm-3">Rol</dt>
            <dd className="col-sm-9">{usuario.rol}</dd>

            <dt className="col-sm-3">Región</dt>
            <dd className="col-sm-9">{usuario.region || '—'}</dd>

            <dt className="col-sm-3">Comuna</dt>
            <dd className="col-sm-9">{usuario.comuna || '—'}</dd>

            <dt className="col-sm-3">Dirección</dt>
            <dd className="col-sm-9">{usuario.direccion || '—'}</dd>
          </dl>
        </div>
      )}

      {editando && (
        /* ===== MODO EDICIÓN ===== */
        <form onSubmit={handleSubmit} className="vapor-card p-4">
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
              <label className="form-label">Nueva contraseña (dejar en blanco para no cambiar)</label>
              <input type="password" name="clave" className="form-control" value={form.clave} onChange={handleChange} />
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

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelar} disabled={guardando}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default AdminPerfil