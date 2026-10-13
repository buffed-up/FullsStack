import React, { useState } from 'react'

function Contactos() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Maneja el envío del formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      alert('Por favor, completa todos los campos.')
      return
    }

    setEnviando(true)

    try {
      const res = await fetch('http://localhost:3000/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Error al enviar mensaje')

      // Mostrar mensaje de éxito
      setEnviado(true)

      // Limpiar formulario después de 4 segundos
      setTimeout(() => {
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' })
        setEnviado(false)
      }, 4000)
    } catch (err) {
      alert('Hubo un error al enviar el mensaje. Intenta de nuevo.')
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      {/* Título */}
      <div className="text-center my-4">
        <h1 className="titulo-caja-vapor">¿NECESITAS AYUDA, JUGADOR?</h1>
        <p className="text-light">Entonces ponte en contacto con nosotros!!!</p>
      </div>

      {/* Formulario */}
      <div className="container mt-5">
        <div className="card vapor-card p-4">
          <div className="card-header" style={{ borderBottom: '2px solid var(--vw-purple)' }}>
            <h3 style={{ color: 'var(--vw-cyan)', textShadow: 'var(--glow-cyan)' }}>
              ENVÍANOS UN MENSAJE
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label" style={{ color: 'var(--vw-cyan)' }}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej. Daniel Villar"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label" style={{ color: 'var(--vw-cyan)' }}>
                  Correo Electrónico
                </label>
                <input
                  type="email" 
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="nombre@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="asunto" className="form-label" style={{ color: 'var(--vw-cyan)' }}>
                Motivo de la consulta
              </label>
              <select
                className="form-select"
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
              >
                <option value="">Seleccione una opción...</option>
                <option value="Producto dañado o defectuoso">Producto dañado o defectuoso</option>
                <option value="Paquete no entregado o perdido">Paquete no entregado o perdido</option>
                <option value="Producto incorrecto o incompleto">Producto incorrecto o incompleto</option>
                <option value="Problemas con la dirección o el repartidor">Problemas con la dirección o el repartidor</option>
                <option value="Otro motivo">Otro motivo</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label" style={{ color: 'var(--vw-cyan)' }}>
                Mensaje
              </label>
              <textarea
                className="form-control"
                id="mensaje"
                name="mensaje"
                rows="4"
                placeholder="Escriba el motivo de su consulta aquí..."
                value={formData.mensaje}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-vapor"
                style={{ padding: '12px 30px' }}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </div>

            {/* Mensaje de éxito */}
            {enviado && (
              <div className="alert alert-success mt-4 text-center" role="alert">
                ¡MENSAJE ENVIADO CON ÉXITO! TE CONTACTAREMOS PRONTO.
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default Contactos