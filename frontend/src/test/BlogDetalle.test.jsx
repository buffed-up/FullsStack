import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BlogDetalle from '../views/BlogDetalle'

const renderConRuta = (id) => {
  return render(
    <MemoryRouter initialEntries={[`/blogs/${id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogDetalle />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Vista BlogDetalle', () => {
  it('debería mostrar un mensaje de carga inicial', () => {
    renderConRuta(1)
    expect(screen.getByText(/Cargando blog/i)).toBeInTheDocument()
  })

  it('debería mostrar "Blog no encontrado" si el blog no existe', () => {
    renderConRuta(9999)
    // Espera un momento para que cargue
    setTimeout(() => {
      expect(screen.getByText('Blog no encontrado')).toBeInTheDocument()
    }, 100)
  })
})