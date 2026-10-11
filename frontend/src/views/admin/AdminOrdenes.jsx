import { useState, useEffect } from 'react'
import { getOrdenes, getOrden, actualizarEstadoOrden } from '../../services/api'

const TABS = ['Listar', 'Detalle']
const ESTADOS = ['pendiente', 'pagada', 'enviada', 'cancelada']

function formatearPrecio(n) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(n)
}

function formatearFecha(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function AdminOrdenes() {
  const [tab, setTab] = useState('Listar')
  const [ordenes, setOrdenes] = useState([])
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const data = await getOrdenes()
      setOrdenes(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const verDetalle = async (id) => {
    setCargandoDetalle(true)
    setError('')
    try {
      const data = await getOrden(id)
      setOrdenSeleccionada(data)
      setTab('Detalle')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargandoDetalle(false)
    }
  }

  const cambiarEstado = async (nuevoEstado) => {
    if (!ordenSeleccionada) return
    setError('')
    setExito('')
    try {
      await actualizarEstadoOrden(ordenSeleccionada.id, nuevoEstado)
      setExito(`Estado cambiado a "${nuevoEstado}".`)
      const actualizada = await getOrden(ordenSeleccionada.id)
      setOrdenSeleccionada(actualizada)
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h2 style={{ color: 'var(--vw-cyan)' }}>Boletas</h2>

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
            ordenes.length === 0 ? (
              <p>No hay boletas registradas.</p>
            ) : (
              <div className="table-responsive">
                <table className="table tabla-vaporwave">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.map(o => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{formatearFecha(o.fecha)}</td>
                        <td>
                          {o.usuario_nombre
                            ? `${o.usuario_nombre} ${o.usuario_apellido || ''}`.trim()
                            : `Usuario #${o.usuario_id}`}
                        </td>
                        <td className="precio-items">{formatearPrecio(o.total)}</td>
                        <td>{o.estado}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => verDetalle(o.id)}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}

      {tab === 'Detalle' && (
        <>
          {cargandoDetalle && <p>Cargando boleta...</p>}

          {!cargandoDetalle && !ordenSeleccionada && (
            <p>Selecciona una boleta en la pestaña <strong>Listar</strong> y haz clic en "Ver".</p>
          )}

          {!cargandoDetalle && ordenSeleccionada && (
            <div className="vapor-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 style={{ color: 'var(--vw-pink)' }}>
                    Boleta #{ordenSeleccionada.id}
                  </h3>
                  <p style={{ opacity: 0.7 }}>
                    Fecha: {formatearFecha(ordenSeleccionada.fecha)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Estado: </strong>
                    <select
                      className="form-select form-select-sm d-inline-block"
                      style={{ width: 'auto', display: 'inline-block' }}
                      value={ordenSeleccionada.estado}
                      onChange={(e) => cambiarEstado(e.target.value)}
                    >
                      {ESTADOS.map(es => (
                        <option key={es} value={es}>{es}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: 'var(--vw-green)' }}>
                    {formatearPrecio(ordenSeleccionada.total)}
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--vw-purple)' }} />

              <h5 style={{ color: 'var(--vw-cyan)' }}>Datos de envío</h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Nombre:</strong> {ordenSeleccionada.nombre_envio || '—'} {ordenSeleccionada.apellido_envio || ''}</p>
                  <p><strong>Correo:</strong> {ordenSeleccionada.correo_envio || '—'}</p>
                  <p><strong>Dirección:</strong> {ordenSeleccionada.direccion || '—'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Región:</strong> {ordenSeleccionada.region || '—'}</p>
                  <p><strong>Comuna:</strong> {ordenSeleccionada.comuna || '—'}</p>
                  <p><strong>Indicaciones:</strong> {ordenSeleccionada.indicaciones || '—'}</p>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--vw-purple)' }} />

              <h5 style={{ color: 'var(--vw-cyan)' }}>Productos</h5>
              <div className="table-responsive">
                <table className="table tabla-vaporwave">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenSeleccionada.items?.map(it => (
                      <tr key={it.id}>
                        <td>
                          {it.img && (
                            <img src={it.img} alt={it.titulo} className="img-items" />
                          )}
                        </td>
                        <td>{it.titulo || `Producto #${it.producto_id}`}</td>
                        <td>{formatearPrecio(it.precio_unitario)}</td>
                        <td>{it.cantidad}</td>
                        <td className="precio-items">
                          {formatearPrecio(it.precio_unitario * it.cantidad)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-end mt-3">
                <h4 style={{ color: 'var(--vw-green)' }}>
                  Total: {formatearPrecio(ordenSeleccionada.total)}
                </h4>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default AdminOrdenes