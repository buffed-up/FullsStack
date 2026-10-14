import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import BlogForm from '../views/blogs/blogForm'

const renderFormNuevo = () => {
  return render(
    <MemoryRouter initialEntries={['/blogs/nuevo']}>
      <AuthProvider>
        <Routes>
          <Route path="/blogs/nuevo" element={<BlogForm />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

const renderFormEditar = (id = 2) => {
  return render(
    <MemoryRouter initialEntries={[`/blogs/${id}/editar`]}>
      <AuthProvider>
        <Routes>
          <Route path="/blogs/:id/editar" element={<BlogForm />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Vista BlogForm', () => {
  beforeEach(() => {
    // Simulamos un usuario logueado (admin) en localStorage
    // ⚠️ AJUSTA la clave si tu AuthContext usa otra
    localStorage.setItem('usuario', JSON.stringify({
      id: 1,
      nombre: 'Admin',
      apellido: 'Test',
      rol: 'admin'
    }))
  })

  it('debería mostrar el título "Nuevo blog" cuando no hay id', () => {
    renderFormNuevo()
    expect(screen.getByText('Nuevo blog')).toBeInTheDocument()
  })

  it('debería mostrar los campos del formulario', () => {
    renderFormNuevo()
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText(/Resumen/i)).toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
    expect(screen.getByText(/Imagen/i)).toBeInTheDocument()
    expect(screen.getByText(/Categoría/i)).toBeInTheDocument()
  })

  it('debería mostrar el botón "Crear" cuando es nuevo', () => {
    renderFormNuevo()
    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
  })

  it('debería tener un input de tipo file para la imagen', () => {
    renderFormNuevo()
    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()
  })

  it('debería mostrar 2 textareas (resumen y contenido)', () => {
    renderFormNuevo()
    const textareas = document.querySelectorAll('textarea')
    expect(textareas.length).toBe(2)
  })

  it('no debería mostrar ningún mensaje de error al inicio', () => {
    renderFormNuevo()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})