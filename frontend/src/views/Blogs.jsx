import React, { useState, useEffect } from 'react'
import BlogCard from '../components/BlogCard'
import { getBlogs } from '../services/api'

function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarBlogs() {
      try {
        const data = await getBlogs()
        setBlogs(data)
      } catch (err) {
        setError('No se pudieron cargar los blogs.')
      } finally {
        setCargando(false)
      }
    }
    cargarBlogs()
  }, [])

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="titulo-caja-vapor">BLOGS</h1>
        <p className="text-light">Noticias, guías y cultura de colección</p>
      </div>

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