import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import BlogDetalle from '../views/blogs/BlogDetalle'

const renderConRuta = (id) => {
  return render(
    <MemoryRouter initialEntries={[`/blogs/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/blogs/:id" element={<BlogDetalle />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Vista BlogDetalle (integración con backend real)', () => {
  it('debería mostrar un mensaje de carga inicial', () => {
    renderConRuta(2)
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería cargar un blog del backend (o mostrar error si no existe)', async () => {
    renderConRuta(2)

    await waitFor(
      () => {
        const tieneTitulo = screen.queryByRole('heading', { level: 1 })
        const noEncontrado = screen.queryByText('Blog no encontrado.')
        const tieneError = screen.queryByText(/Error:/i) || screen.queryByText(/Error/i)

        expect(tieneTitulo || noEncontrado || tieneError).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar "Blog no encontrado" si el blog no existe', async () => {
    renderConRuta(999999)

    await waitFor(
      () => {
        const tieneError = screen.queryByText(/Blog no encontrado/i) 
        expect(tieneError).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })
})