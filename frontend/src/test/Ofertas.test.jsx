import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CarritoProvider } from '../context/CarritoContext'
import Ofertas from '../views/productos/Ofertas'

const renderConProviders = (componente) => {
  return render(
    <BrowserRouter>
      <CarritoProvider>{componente}</CarritoProvider>
    </BrowserRouter>
  )
}

describe('Vista Ofertas (integración con backend real)', () => {
  it('debería renderizar el título "OFERTAS"', () => {
    renderConProviders(<Ofertas />)
    expect(screen.getByText('OFERTAS')).toBeInTheDocument()
  })

  it('debería mostrar el subtítulo "Los mejores descuentos de la tienda"', () => {
    renderConProviders(<Ofertas />)
    expect(screen.getByText('Los mejores descuentos de la tienda')).toBeInTheDocument()
  })

  it('debería mostrar un mensaje de carga inicial', () => {
    renderConProviders(<Ofertas />)
    // Al inicio, antes de que el fetch termine, muestra "Cargando ofertas..."
    expect(screen.getByText(/Cargando ofertas/i)).toBeInTheDocument()
  })

  it('debería cargar las ofertas del backend (o mostrar vacío/error)', async () => {
    renderConProviders(<Ofertas />)

    await waitFor(
      () => {
        const estaVacio = screen.queryByText('No hay ofertas disponibles.')
        const tieneError = screen.queryByText(/Error/i)
        const tieneTarjetas = document.querySelectorAll('.card').length > 0

        expect(estaVacio || tieneError || tieneTarjetas).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })
})