import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CarritoProvider } from '../context/CarritoContext'
import Ofertas from '../views/Ofertas'

const renderConProviders = (componente) => {
  return render(
    <BrowserRouter>
      <CarritoProvider>{componente}</CarritoProvider>
    </BrowserRouter>
  )
}

describe('Vista Ofertas', () => {
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
    // Al inicio muestra "Cargando ofertas..."
    expect(screen.getByText(/Cargando ofertas|No hay ofertas/i)).toBeInTheDocument()
  })
})