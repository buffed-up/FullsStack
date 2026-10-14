import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Admin() {
  const { usuario } = useAuth()

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container my-5">
      <h2 style={{ color: 'var(--vw-cyan)' }}>Panel de administración</h2>
      <p>Bienvenido, {usuario.nombre} {usuario.apellido}.</p>
      <p>Aquí irá el CRUD de productos y usuarios (pendiente).</p>
    </div>
  )
}

export default Admin