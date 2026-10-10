import { useAuth } from '../../context/AuthContext'

function AdminPerfil() {
  const { usuario } = useAuth()

  return (
    <>
      <h2 style={{ color: 'var(--vw-cyan)' }}>Perfil</h2>
      <ul>
        <li>Nombre: {usuario.nombre} {usuario.apellido}</li>
        <li>Correo: {usuario.correo}</li>
        <li>RUN: {usuario.run}</li>
        <li>Rol: {usuario.rol}</li>
      </ul>
      <p>(Edición pendiente.)</p>
    </>
  )
}

export default AdminPerfil