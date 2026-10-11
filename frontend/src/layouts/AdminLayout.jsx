import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminLayout() {
  const { usuario } = useAuth()

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />
  }

  const linkClass = ({ isActive }) =>
    isActive ? 'sidebar-link active' : 'sidebar-link'

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="sidebar-titulo">Panel Admin</div>
        <nav>
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/productos" className={linkClass}>Productos</NavLink>
          <NavLink to="/admin/categorias" className={linkClass}>Categorías</NavLink>
          <NavLink to="/admin/usuarios" className={linkClass}>Usuarios</NavLink>
          <NavLink to="/admin/ordenes" className={linkClass}>Boletas</NavLink>
          <NavLink to="/admin/reportes" className={linkClass}>Reportes</NavLink>
          <NavLink to="/admin/perfil" className={linkClass}>Perfil</NavLink>
          <NavLink to="/admin/productos-criticos" className={linkClass}>Productos críticos</NavLink>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout