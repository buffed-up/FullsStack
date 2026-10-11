import { useLocation, Link } from 'react-router-dom'

function formatearPrecio(n) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(n)
}

function PagoOk() {
  const { state } = useLocation()
  const orden = state?.orden

  return (
    <div className="container my-5" style={{ maxWidth: '720px' }}>
      <div className="vapor-card p-4">
        <h2 style={{ color: 'var(--vw-green)' }}>✓ Pago realizado con éxito</h2>

        {orden ? (
          <>
            <p style={{ opacity: 0.8 }}>Boleta #{orden.id}</p>

            <hr style={{ borderColor: 'var(--vw-purple)' }} />

            <h5 style={{ color: 'var(--vw-cyan)' }}>Productos</h5>
            <div className="table-responsive">
              <table className="table tabla-vaporwave">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orden.items?.map(it => (
                    <tr key={it.id}>
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
                Total: {formatearPrecio(orden.total)}
              </h4>
            </div>
          </>
        ) : (
          <p>Tu compra fue registrada.</p>
        )}

        <div className="mt-4">
          <Link to="/productos" className="btn btn-vapor">Seguir comprando</Link>
        </div>
      </div>
    </div>
  )
}

export default PagoOk