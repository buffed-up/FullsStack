import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProducto } from '../../services/api'
import { useCarrito } from '../../context/CarritoContext'

function ProductoDetalle() {
  const { id } = useParams()
  const { agregarAlCarrito } = useCarrito()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCargando(true)
    setError(null)
    getProducto(id)
      .then(data => setProducto(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return <div className="container my-5"><p>Cargando...</p></div>
  if (error) return <div className="container my-5"><div className="alert alert-danger">{error}</div></div>
  if (!producto) return <div className="container my-5"><p>Producto no encontrado.</p></div>

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(producto.precio)

  const agregar = () => {
    agregarAlCarrito(producto.id, producto.titulo, producto.precio, producto.img)
  }

  return (
    <div className="container my-5">
      <Link to="/productos" className="btn btn-secondary mb-3">← Volver</Link>

      <div className="vapor-card p-4">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            {producto.img && (
              <img
                src={producto.img}
                alt={producto.titulo}
                className="img-fluid rounded"
                style={{ background: '#000', maxHeight: '500px', objectFit: 'contain', width: '100%' }}
              />
            )}
          </div>
          <div className="col-md-6">
            <h1 style={{ color: 'var(--vw-pink)', textShadow: 'var(--glow-pink)' }}>
              {producto.titulo}
            </h1>

            {producto.coleccion && (
              <p style={{ color: 'var(--vw-cyan)', opacity: 0.85 }}>
                Colección: {producto.coleccion}
              </p>
            )}

            {producto.descripcion && (
              <p style={{ color: 'var(--vw-text)', opacity: 0.9, marginTop: '1rem' }}>
                {producto.descripcion}
              </p>
            )}

            <hr style={{ borderColor: 'var(--vw-purple)' }} />

            <p className="vapor-price" style={{ fontSize: '2.5rem', margin: 0 }}>
              {precioFormateado}
            </p>

            <p style={{ color: 'var(--vw-text)', opacity: 0.7, marginTop: '0.5rem' }}>
              Stock disponible: {producto.stock ?? 0}
            </p>

            {!producto.es_portada && (
              <button
                className="btn btn-vapor mt-3"
                onClick={agregar}
                disabled={producto.stock === 0}
              >
                {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetalle