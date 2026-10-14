import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CarritoProvider } from '../context/CarritoContext'
import ProductoDetalle from '../views/productos/ProductoDetalle'

const renderConRuta = (id) => {
  return render(
    <MemoryRouter initialEntries={[`/producto/${id}`]}>
      <CarritoProvider>
        <Routes>
          <Route path="/producto/:id" element={<ProductoDetalle />} />
        </Routes>
      </CarritoProvider>
    </MemoryRouter>
  )
}

describe('Vista ProductoDetalle', () => {
  it('debería mostrar un mensaje si el producto no existe', async () => {
    renderConRuta(9999)

    await waitFor(
      () => {
        const mensaje = screen.queryByText(/no encontrado/i)
        expect(mensaje).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el botón "← Volver"', async () => {
    renderConRuta(2)

    await waitFor(
      () => {
        expect(screen.getByText('← Volver')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el botón "Agregar al carrito"', async () => {
    renderConRuta(2)

    await waitFor(
      () => {
        // El botón dice "Agregar al carrito" o "Sin stock" según el stock
        const boton = screen.queryByText('Agregar al carrito') || screen.queryByText('Sin stock')
        expect(boton).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el precio del producto', async () => {
    renderConRuta(2)

    await waitFor(
      () => {
        // El precio se muestra formateado como "$XX.XXX"
        expect(screen.getByText(/\$/)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})