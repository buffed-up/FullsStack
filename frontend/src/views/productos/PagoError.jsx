import React from 'react'
import { useLocation, Link } from 'react-router-dom'

function PagoError() {
  const { state } = useLocation()
  const mensaje = state?.mensaje || 'No se pudo completar el pago.'

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="vapor-card p-4 text-center">
        <h2 style={{ color: 'var(--vw-pink)' }}>✗ No se pudo realizar el pago</h2>
        <p className="texto-blanco-chico" style={{ marginTop: '1rem' }}>{mensaje}</p>

        <div className="mt-4 d-flex gap-2 justify-content-center">
          <Link to="/carrito" className="btn btn-vapor">Volver al carrito</Link>
          <Link to="/productos" className="btn btn-secondary">Ver productos</Link>
        </div>
      </div>
    </div>
  )
}

export default PagoError