import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { crearUsuario } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function Registro() {
  const [form, setForm] = useState({
    run: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      // rol siempre cliente desde el frontend
      const usuario = await crearUsuario({ ...form, rol: 'cliente' })
      login(usuario)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Error al registrar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4" style={{ color: 'var(--vw-cyan)' }}>Crear cuenta</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
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

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" name="clave" className="form-control" value={form.clave} onChange={handleChange} required />
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

        <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-3 text-center">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  )
}

export default Registro