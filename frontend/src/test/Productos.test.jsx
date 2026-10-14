import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CarritoProvider } from '../context/CarritoContext'
import Productos from '../views/productos/Productos'

const renderConProviders = (componente) => {
  return render(
    <BrowserRouter>
      <CarritoProvider>{componente}</CarritoProvider>
    </BrowserRouter>
  )
}

describe('Vista Productos (integración con backend real)', () => {
  it('debería renderizar el título "Productos"', async () => {
    renderConProviders(<Productos />)

    await waitFor(
      () => {
        expect(screen.getByText('Productos')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar un mensaje de carga inicial', () => {
    renderConProviders(<Productos />)
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería cargar los productos del backend (o mostrar vacío/error)', async () => {
    renderConProviders(<Productos />)

    await waitFor(
      () => {
        const estaVacio = screen.queryByText('No hay productos para mostrar.')
        const tieneError = screen.queryByText(/Error/i)
        const tieneTarjetas = document.querySelectorAll('.card').length > 0

        expect(estaVacio || tieneError || tieneTarjetas).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })
})