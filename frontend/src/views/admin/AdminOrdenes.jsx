import { useState } from 'react'

const TABS = ['Listar', 'Detalle']

function AdminOrdenes() {
  const [tab, setTab] = useState('Listar')

  return (
    <>
      <h2 style={{ color: 'var(--vw-cyan)' }}>Órdenes</h2>

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

      {tab === 'Listar'  && <p>Aquí va la tabla de órdenes (pendiente).</p>}
      {tab === 'Detalle' && <p>Aquí se verá el detalle de una orden / boleta (pendiente).</p>}
    </>
  )
}

export default AdminOrdenes