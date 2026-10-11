import React from 'react'
import { useNavigate } from 'react-router-dom'

function BlogCard({ blog }) {
  const navigate = useNavigate()
  const { id, titulo, fecha, categoria, img, resumen } = blog

  return (
    <div className="col-md-4 mb-4">
      <div
        className="card bg-dark text-white h-100 border-purple"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/blog/${id}`)}
      >
        <img
          src={img}
          className="card-img-top"
          alt={titulo}
          style={{ height: '420px', objectFit: 'cover', width: '100%' }}
        />
        <div className="card-body d-flex flex-column">
          <span className="genero-juego mb-2">
            {fecha} | {categoria}
          </span>
          <h3 className="h5 text-pink" style={{ minHeight: '48px' }}>
            {titulo}
          </h3>
          <p className="card-text text-light fs-6">{resumen}</p>
          <button className="btn-vapor mt-auto align-self-start">
            LEER MÁS
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogCard