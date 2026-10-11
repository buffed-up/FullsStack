import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'
import { crearOrden } from '../services/api'
import React from 'react'

function Carrito() {
  const {
    carrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    totalPrecio
  } = useCarrito()

  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [cupon, setCupon] = useState('')
  const [descuentoAplicado, setDescuentoAplicado] = useState(false)

  const [envio, setEnvio] = useState({
    nombre_envio: usuario?.nombre || '',
    apellido_envio: usuario?.apellido || '',
    correo_envio: usuario?.correo || '',
    direccion: usuario?.direccion || '',
    region: usuario?.region || '',
    comuna: usuario?.comuna || '',
    indicaciones: ''
  })

  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const handleEnvioChange = (e) => {
    setEnvio({ ...envio, [e.target.name]: e.target.value })
  }

  const aplicarCupon = () => {
    if (cupon.trim().toUpperCase() === 'VAPOR10') {
      setDescuentoAplicado(true)
      alert('¡Cupón aplicado! 10% de descuento.')
    } else {
      alert('Cupón inválido.')
    }
  }

  const totalFinal = descuentoAplicado ? Math.round(totalPrecio * 0.9) : totalPrecio

  const pagar = async () => {
    setError('')

    if (carrito.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }

    if (!usuario) {
      navigate('/login')
      return
    }

    if (!envio.direccion.trim() || !envio.region.trim() || !envio.comuna.trim()) {
      setError('Completa dirección, región y comuna antes de pagar.')
      return
    }

    setEnviando(true)
    try {
      const payload = {
        usuario_id: usuario.id,
        nombre_envio: envio.nombre_envio || null,
        apellido_envio: envio.apellido_envio || null,
        correo_envio: envio.correo_envio || null,
        direccion: envio.direccion || null,
        region: envio.region || null,
        comuna: envio.comuna || null,
        indicaciones: envio.indicaciones || null,
        items: carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad
        }))
      }

      const orden = await crearOrden(payload)
      vaciarCarrito()
      setDescuentoAplicado(false)
      setCupon('')
      navigate('/pago-ok', { state: { orden } })
    } catch (e) {
      navigate('/pago-error', { state: { mensaje: e.message } })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="titulo-caja-vapor text-center mb-5">Mi carrito de compras</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {!usuario && (
        <div className="alert alert-info">
          Debes <a href="/login">iniciar sesión</a> para completar la compra.
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          {carrito.length === 0 ? (
            <p className="text-center">Tu carrito está vacío.</p>
          ) : (
            carrito.map(item => (
              <div key={item.id} className="row align-items-center mb-4 vapor-card p-3">
                <div className="col-3">
                  <img
                    src={item.img}
                    alt={item.titulo}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'contain',
                      backgroundColor: '#000'
                    }}
                  />
                </div>
                <div className="col-5">
                  <h5 className="vapor-title">{item.titulo}</h5>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    Precio unitario: ${item.precio}
                  </p>
                </div>
                <div className="col-4 text-end">
                  <div className="d-flex justify-content-end align-items-center gap-2">
                    <button className="btn btn-sm btn-vapor" onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                    <span className="vapor-price">{item.cantidad}</span>
                    <button className="btn btn-sm btn-vapor" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                  </div>
                  <p className="vapor-price mt-2" style={{ fontSize: '1.2rem' }}>
                    ${item.precio * item.cantidad}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-danger mt-1"
                    onClick={() => quitarDelCarrito(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="col-md-4">
          <div className="card vapor-card p-4">
            <h4 className="vapor-title mb-3">TOTAL:</h4>
            <h2 className="vapor-price text-end" style={{ fontSize: '2.5rem' }}>
              ${totalFinal}
            </h2>

            <hr style={{ borderColor: 'var(--vw-purple)' }} />

            <label
              htmlFor="cupon"
              className="form-label"
              style={{ color: 'var(--vw-cyan)', fontFamily: "'Press Start 2P'", fontSize: '0.7rem' }}
            >
              Ingrese su cupón de descuento
            </label>
            <div className="d-flex gap-2 mt-2 mb-4">
              <input
                type="text"
                id="cupon"
                className="form-control"
                placeholder="CUPON"
                value={cupon}
                onChange={(e) => setCupon(e.target.value)}
                style={{
                  background: 'rgba(26,11,46,0.8)',
                  border: '1px solid var(--vw-purple)',
                  color: 'var(--vw-text)'
                }}
              />
              <button
                className="btn btn-sm"
                style={{ background: 'var(--vw-purple)', color: '#fff' }}
                onClick={aplicarCupon}
              >
                APLICAR
              </button>
            </div>

            <hr style={{ borderColor: 'var(--vw-purple)' }} />

            <h5 style={{ color: 'var(--vw-cyan)' }}>Datos de envío</h5>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Nombre</label>
              <input name="nombre_envio" className="form-control form-control-sm" value={envio.nombre_envio} onChange={handleEnvioChange} />
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Apellido</label>
              <input name="apellido_envio" className="form-control form-control-sm" value={envio.apellido_envio} onChange={handleEnvioChange} />
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Correo</label>
              <input name="correo_envio" type="email" className="form-control form-control-sm" value={envio.correo_envio} onChange={handleEnvioChange} />
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Dirección *</label>
              <input name="direccion" className="form-control form-control-sm" value={envio.direccion} onChange={handleEnvioChange} />
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Región *</label>
              <input name="region" className="form-control form-control-sm" value={envio.region} onChange={handleEnvioChange} />
            </div>

            <div className="mb-2">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Comuna *</label>
              <input name="comuna" className="form-control form-control-sm" value={envio.comuna} onChange={handleEnvioChange} />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Indicaciones (opcional)</label>
              <textarea name="indicaciones" className="form-control form-control-sm" rows="2" value={envio.indicaciones} onChange={handleEnvioChange} />
            </div>

            <button
              className="btn btn-vapor w-100 mt-3"
              style={{
                backgroundColor: 'var(--vw-green)',
                color: '#000',
                border: '2px solid var(--vw-green)',
                fontSize: '1rem',
                padding: '15px'
              }}
              onClick={pagar}
              disabled={enviando || carrito.length === 0}
            >
              {enviando ? 'Procesando...' : 'PAGAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carrito