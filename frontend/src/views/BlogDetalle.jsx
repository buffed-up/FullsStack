import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlog } from '../services/api'

function BlogDetalle() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarBlog() {
      try {
        const data = await getBlog(id)
        setBlog(data)
      } catch (err) {
        setBlog(null)
      } finally {
        setCargando(false)
      }
    }
    cargarBlog()
  }, [id])

  if (cargando) {
    return (
      <div className="container mt-5">
        <p className="text-center text-light">Cargando blog...</p>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mt-5">
        <h2 className="text-center">Blog no encontrado</h2>
        <div className="text-center mt-4">
          <Link to="/blogs" className="btn btn-vapor">← Volver a Blogs</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <Link to="/blogs" className="btn btn-vapor" style={{ fontSize: '0.8rem' }}>
          ← Volver a Blogs
        </Link>
      </div>

      <div className="mb-4">
        <img
          src={blog.img}
          alt={blog.titulo}
          className="img-fluid w-100"
          style={{ height: '400px', objectFit: 'cover', border: '2px solid var(--vw-purple)' }}
        />
      </div>

      <div className="mb-3">
        <span style={{ color: 'var(--vw-cyan)', fontSize: '0.9rem' }}>
          {blog.fecha} | {blog.categoria}
        </span>
      </div>

      <h1 className="titulo-caja-vapor mb-4" style={{ fontSize: '1.8rem' }}>
        {blog.titulo}
      </h1>

      <div className="vapor-descripcion" style={{ fontSize: '1.3rem', lineHeight: '1.8' }}>
        {blog.contenido}
      </div>
    </div>
  )
}

export default BlogDetalle