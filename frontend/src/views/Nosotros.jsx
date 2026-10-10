import React from 'react'

function Nosotros() {
  return (
    <div className="container mt-5 mb-5">

      {/* Título */}
      <div className="text-center mb-5">
        <h1 className="titulo-caja-vapor">SOBRE NOSOTROS</h1>
      </div>

      {/* Hero: Imagen + Introducción */}
      <div className="row align-items-center mb-5">
        <div className="col-md-5 mb-4 mb-md-0">
          <img
            src="/img/logo.png"
            alt="BOOSTED UP!"
            className="img-fluid"
            style={{
              border: '3px solid var(--vw-purple)',
              borderRadius: '10px',
              boxShadow: '0 0 30px rgba(185, 103, 255, 0.4)',
              padding: '20px',
              background: '#000'
            }}
          />
        </div>
        <div className="col-md-7">
          <h2 style={{ color: 'var(--vw-cyan)', textShadow: 'var(--glow-cyan)' }}>
            Nacimos en 2026
          </h2>
          <p className="texto-blanco">
            <strong>BOOSTED UP!</strong> nació en 2026 después de estar hartos de que las tiendas
            geek tradicionales solo vendieran Gundams, figuras típicas de anime y Funkos.
          </p>
          <p className="texto-blanco">
            Queríamos hacer algo diferente: una tienda que mantuviera la esencia de lo geek,
            pero con <strong>artículos más únicos</strong> y un fuerte enfoque en
            <strong> ayudar a quienes practican el cosplay</strong>, dándoles acceso a materiales,
            props y piezas que normalmente son difíciles de encontrar en el mercado local.
          </p>
        </div>
      </div>

      {/* Cards: Misión, Visión, Valores */}
      <div className="row justify-content-center g-4 mb-5">
        <div className="col-md-4">
          <div className="card vapor-card h-100 text-center p-4">
            <div style={{ fontSize: '3rem' }}>🎯</div>
            <h3 className="mt-3" style={{ color: 'var(--vw-pink)' }}>Nuestra Misión</h3>
            <p className="texto-blanco">
              Ofrecer artículos únicos y de calidad para la comunidad geek y cosplayer,
              rompiendo con lo tradicional y dando espacio a lo auténtico.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card vapor-card h-100 text-center p-4">
            <div style={{ fontSize: '3rem' }}>👁️</div>
            <h3 className="mt-3" style={{ color: 'var(--vw-pink)' }}>Nuestra Visión</h3>
            <p className="texto-blanco">
              Convertirnos en el punto de referencia para cosplayers y coleccionistas
              en Chile, siendo reconocidos por nuestra curaduría única y apoyo a la comunidad.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card vapor-card h-100 text-center p-4">
            <div style={{ fontSize: '3rem' }}>💎</div>
            <h3 className="mt-3" style={{ color: 'var(--vw-pink)' }}>Nuestros Valores</h3>
            <p className="texto-blanco">
              Autenticidad, pasión por la cultura geek, apoyo a los artistas y creadores,
              y compromiso con la calidad en cada producto que ofrecemos.
            </p>
          </div>
        </div>
      </div>

      {/* Sección: ¿Por qué elegirnos? */}
      <div className="mb-5">
        <h2 className="text-center mb-4" style={{ color: 'var(--vw-cyan)', textShadow: 'var(--glow-cyan)' }}>
          ¿Por qué elegirnos?
        </h2>
        <div className="row justify-content-center g-4">
          <div className="col-md-6">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="texto-blanco" style={{ marginBottom: '1rem' }}>
                 <strong>Curaduría única:</strong> No vendemos lo típico. Buscamos piezas especiales.
              </li>
              <li className="texto-blanco" style={{ marginBottom: '1rem' }}>
                 <strong>Enfoque cosplayer:</strong> Materiales, props y accesorios para tus trajes.
              </li>
              <li className="texto-blanco" style={{ marginBottom: '1rem' }}>
                 <strong>Envíos a todo Chile:</strong> Llevamos tus productos donde los necesites.
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li className="texto-blanco" style={{ marginBottom: '1rem' }}>
                 <strong>Atención personalizada:</strong> Te ayudamos a encontrar lo que buscas.
              </li>
              <li className="texto-blanco" style={{ marginBottom: '1rem' }}>
                 <strong>Productos exclusivos:</strong> Colaboraciones con artistas locales.
              </li>
              <li className="texto-blanco" style={{ marginBottom: '1rem' }}>
                 <strong>Comunidad activa:</strong> Organizamos eventos y concursos de cosplay.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cierre */}
      <div className="text-center mt-5">
        <h3 style={{ color: 'var(--vw-pink)', textShadow: 'var(--glow-pink)' }}>
          "Porque ser geek no es solo consumir: es crear, es vivir la cultura."
        </h3>
        <p className="texto-blanco" style={{ marginTop: '1rem'  }}>
          — El equipo de BOOSTED UP!
        </p>
      </div>

    </div>
  )
}

export default Nosotros