import { useState } from 'react'

const TABS = ['Listar', 'Nuevo', 'Editar']

function AdminUsuarios() {
  const [tab, setTab] = useState('Listar')

  return (
    <>
      <h2 style={{ color: 'var(--vw-cyan)' }}>Usuarios</h2>

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

      {tab === 'Listar' && <p>Aquí va la tabla de usuarios (pendiente).</p>}
      {tab === 'Nuevo'  && <p>Aquí va el formulario de nuevo usuario (pendiente).</p>}
      {tab === 'Editar' && <p>Aquí va el formulario de edición de usuario (pendiente).</p>}
    </>
  )
}

export default AdminUsuarios