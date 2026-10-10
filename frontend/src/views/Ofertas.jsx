import React, { useState, useEffect } from 'react'
import { getProductos } from '../services/api'
import { useCarrito } from '../context/CarritoContext'

function Ofertas() {
  const [ofertas, setOfertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const { agregarAlCarrito } = useCarrito()

  // Convierte "$15.990" a número 15990
  const limpiarPrecio = (precioTexto) => {
    return parseInt(precioTexto.replace(/[$.]/g, '').replace(/\s/g, ''))
  }

  // Formatea 15990 a "$15.990"
  const formatearPrecio = (numero) => {
    return '$' + numero.toLocaleString('es-CL')
  }

  useEffect(() => {
    async function cargarOfertas() {
      try {
        const productos = await getProductos()
        // Filtra solo los productos que están en oferta
        const soloOfertas = productos.filter(p => p.en_oferta === true && p.descuento > 0)
        setOfertas(soloOfertas)
      } catch (err) {
        setError('No se pudieron cargar las ofertas.')
      } finally {
        setCargando(false)
      }
    }
    cargarOfertas()
  }, [])

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="titulo-caja-vapor">OFERTAS</h1>
        <p className="text-light">Los mejores descuentos de la tienda</p>
      </div>

      {cargando && <p className="text-center text-light">Cargando ofertas...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {!cargando && !error && ofertas.length === 0 && (
        <p className="text-center text-light">No hay ofertas disponibles por ahora.</p>
      )}

      <div className="row justify-content-center g-4">
        {ofertas.map(producto => {
          const precioOriginal = limpiarPrecio(producto.precio)
          const precioOferta = Math.round(precioOriginal * (1 - producto.descuento / 100))

          return (
            <div key={producto.id} className="col-6 col-md-4 col-lg-3 mb-4">
              <div className="card vapor-card h-100 text-center position-relative">

                {/* Etiqueta de descuento */}
                <span
                  className="position-absolute top-0 end-0 m-2"
                  style={{
                    background: 'var(--vw-pink)',
                    color: 'var(--vw-bg)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontFamily: "'Press Start 2P'",
                    fontSize: '0.7rem',
                    boxShadow: '0 0 10px var(--vw-pink)',
                    zIndex: 2
                  }}
                >
                  -{producto.descuento}%
                </span>

                <img
                  src={producto.img}
                  className="card-img-top vapor-img"
                  alt={producto.titulo}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title vapor-title">{producto.titulo}</h5>

                  {/* Precio original tachado */}
                  <p
                    className="mt-auto mb-1"
                    style={{
                      color: 'var(--vw-text)',
                      opacity: 0.6,
                      textDecoration: 'line-through',
                      fontSize: '1rem'
                    }}
                  >
                    {formatearPrecio(precioOriginal)}
                  </p>

                  {/* Precio con descuento */}
                  <p
                    className="vapor-price mb-2"
                    style={{ fontSize: '1.6rem', color: 'var(--vw-green)' }}
                  >
                    {formatearPrecio(precioOferta)}
                  </p>

                  <button
                    className="btn btn-vapor mt-2"
                    onClick={() => agregarAlCarrito(
                      producto.id,
                      producto.titulo,
                      precioOferta,
                      producto.img
                    )}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Ofertas