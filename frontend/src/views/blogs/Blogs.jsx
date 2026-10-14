import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BlogCard from '../../components/BlogCard'
import { getBlogs } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const { usuario } = useAuth()

  useEffect(() => {
    getBlogs()
      .then(data => setBlogs(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="titulo-caja-vapor">BLOGS</h1>
        <p className="text-light">Noticias, guías y cultura de colección</p>
      </div>

      {usuario && (
        <div className="text-center mb-4">
          <Link to="/blogs/nuevo" className="btn btn-primary">Crear nuevo blog</Link>
        </div>
      )}

      {!usuario && (
        <div className="alert alert-info text-center" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
          <Link to="/login">Inicia sesión</Link> para crear un blog o comentar.
        </div>
      )}

      {cargando && <p className="text-center text-light">Cargando blogs...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {!cargando && !error && blogs.length === 0 && (
        <p className="text-center text-light">No hay blogs disponibles.</p>
      )}

      <div className="row">
        {blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default Blogs