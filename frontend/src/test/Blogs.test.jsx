import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Blogs from '../views/blogs/Blogs'

const renderConProviders = (componente) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {componente}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Vista Blogs (integración con backend real)', () => {
  it('debería renderizar el título "BLOGS"', () => {
    renderConProviders(<Blogs />)
    expect(screen.getByText('BLOGS')).toBeInTheDocument()
  })

  it('debería mostrar el subtítulo "Noticias, guías y cultura de colección"', () => {
    renderConProviders(<Blogs />)
    expect(screen.getByText('Noticias, guías y cultura de colección')).toBeInTheDocument()
  })

  it('debería mostrar un mensaje de carga inicial', () => {
    renderConProviders(<Blogs />)
    // Al inicio, antes de que el fetch termine, muestra "Cargando blogs..."
    expect(screen.getByText(/Cargando blogs/i)).toBeInTheDocument()
  })

  it('debería cargar los blogs del backend (o mostrar vacío/error)', async () => {
    renderConProviders(<Blogs />)

    await waitFor(
      () => {
        const estaVacio = screen.queryByText('No hay blogs disponibles.')
        const tieneError = screen.queryByText(/Error/i)
        const tieneTarjetas = document.querySelectorAll('.card').length > 0

        expect(estaVacio || tieneError || tieneTarjetas).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })
})