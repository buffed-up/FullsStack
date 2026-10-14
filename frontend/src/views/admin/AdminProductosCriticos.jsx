import React, { useState, useEffect } from 'react'
import { getReportes } from '../../services/api'

function formatearPrecio(n) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(n)
}

function AdminProductosCriticos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getReportes()
      .then(data => setProductos(data.productosCriticos || []))
      .catch(e => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p>Cargando...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <h2 style={{ color: 'var(--vw-pink)' }}>
        ⚠ Productos críticos
      </h2>
      <p style={{ opacity: 0.7 }}>Productos con stock menor o igual a 5.</p>

      {productos.length === 0 ? (
        <p>No hay productos críticos.</p>
      ) : (
        <div className="table-responsive">
          <table className="table tabla-vaporwave">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Stock</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.titulo}</td>
                  <td className="precio-items" style={{ color: 'var(--vw-pink)' }}>{p.stock}</td>
                  <td>{formatearPrecio(p.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default AdminProductosCriticos