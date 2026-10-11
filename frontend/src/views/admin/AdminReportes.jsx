import { useState, useEffect } from 'react'
import { getReportes } from '../../services/api'

function formatearPrecio(n) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(n)
}

function AdminReportes() {
  const [reportes, setReportes] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getReportes()
      .then(data => setReportes(data))
      .catch(e => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p>Cargando reportes...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!reportes) return <p>Sin datos.</p>

  const { ventasTotales, boletasPorEstado, productosPorCategoria, productosMasVendidos, ingresosPorMes } = reportes

  return (
    <>
      <h2 style={{ color: 'var(--vw-cyan)' }}>Reportes</h2>

      {/* ===== VENTAS TOTALES ===== */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="vapor-card p-4">
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Ventas totales</div>
            <div style={{ fontSize: '2.5rem', color: 'var(--vw-green)' }}>
              {formatearPrecio(ventasTotales.total)}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="vapor-card p-4">
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Boletas registradas</div>
            <div style={{ fontSize: '2.5rem', color: 'var(--vw-cyan)' }}>
              {ventasTotales.cantidad}
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOLETAS POR ESTADO ===== */}
      <h4 style={{ color: 'var(--vw-cyan)', marginTop: '2rem' }}>Boletas por estado</h4>
      <div className="table-responsive mb-4">
        <table className="table tabla-vaporwave">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {boletasPorEstado.length === 0 ? (
              <tr><td colSpan="2">Sin datos.</td></tr>
            ) : (
              boletasPorEstado.map(b => (
                <tr key={b.estado}>
                  <td>{b.estado}</td>
                  <td className="precio-items">{b.cantidad}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PRODUCTOS POR CATEGORÍA ===== */}
      <h4 style={{ color: 'var(--vw-cyan)', marginTop: '2rem' }}>Productos por categoría</h4>
      <div className="table-responsive mb-4">
        <table className="table tabla-vaporwave">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Cantidad de productos</th>
            </tr>
          </thead>
          <tbody>
            {productosPorCategoria.map(c => (
              <tr key={c.categoria}>
                <td>{c.categoria}</td>
                <td className="precio-items">{c.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PRODUCTOS MÁS VENDIDOS ===== */}
      <h4 style={{ color: 'var(--vw-cyan)', marginTop: '2rem' }}>Top 10 productos más vendidos</h4>
      <div className="table-responsive mb-4">
        <table className="table tabla-vaporwave">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Unidades vendidas</th>
            </tr>
          </thead>
          <tbody>
            {productosMasVendidos.map((p, i) => (
              <tr key={p.producto_id}>
                <td className="ranking">{i + 1}</td>
                <td>{p.titulo}</td>
                <td className="precio-items">{p.total_vendido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== INGRESOS POR MES ===== */}
      <h4 style={{ color: 'var(--vw-cyan)', marginTop: '2rem' }}>Ingresos por mes</h4>
      <div className="table-responsive mb-4">
        <table className="table tabla-vaporwave">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Boletas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ingresosPorMes.length === 0 ? (
              <tr><td colSpan="3">Sin datos.</td></tr>
            ) : (
              ingresosPorMes.map(m => (
                <tr key={m.mes}>
                  <td>{m.mes}</td>
                  <td>{m.cantidad}</td>
                  <td className="precio-items">{formatearPrecio(m.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminReportes