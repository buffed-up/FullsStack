import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Index from '../views/pagina/Index'

const renderConRouter = (componente) => {
  return render(<BrowserRouter>{componente}</BrowserRouter>)
}

describe('Vista Index (integración con backend real)', () => {
  it('debería mostrar un mensaje de carga inicial', () => {
    renderConRouter(<Index />)
    // antes de que el fetch termine muestra cargando
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería renderizar el carrusel después de cargar', async () => {
    renderConRouter(<Index />)

    await waitFor(
      () => {
        const carrusel = document.querySelector('.carousel')
        expect(carrusel).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el título "NUEVOS LANZAMIENTOS"', async () => {
    renderConRouter(<Index />)

    await waitFor(
      () => {
        expect(screen.getByText('NUEVOS LANZAMIENTOS')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar al menos un producto destacado del backend', async () => {
    renderConRouter(<Index />)

    await waitFor(
      () => {
        const tarjetas = document.querySelectorAll('.card')
        const filasTabla = document.querySelectorAll('.tabla-vaporwave tbody tr')
        expect(tarjetas.length + filasTabla.length).toBeGreaterThan(0)
      },
      { timeout: 5000 }
    )
  })
})