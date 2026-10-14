import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PagoOk from '../views/productos/PagoOk'

// Helper: permite pasar `state` a useLocation
const renderConOrden = (orden = null) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/pago-ok', state: { orden } }]}>
      <PagoOk />
    </MemoryRouter>
  )
}

describe('Vista PagoOk', () => {
  it('debería mostrar el mensaje "Pago realizado con éxito"', () => {
    renderConOrden()
    expect(screen.getByText(/Pago realizado con éxito/i)).toBeInTheDocument()
  })

  it('debería mostrar "Tu compra fue registrada" si no hay orden en el state', () => {
    renderConOrden(null)
    expect(screen.getByText('Tu compra fue registrada.')).toBeInTheDocument()
  })

  it('debería mostrar el botón "Seguir comprando"', () => {
    renderConOrden()
    expect(screen.getByText('Seguir comprando')).toBeInTheDocument()
  })

  it('debería mostrar los productos de la orden cuando hay una', () => {
    const ordenFake = {
      id: 123,
      total: 45000,
      items: [
        { id: 1, titulo: 'Figura Yujiro Hanma', precio_unitario: 20000, cantidad: 2 },
        { id: 2, titulo: 'Cosplay Dio', precio_unitario: 5000, cantidad: 1 }
      ]
    }

    renderConOrden(ordenFake)

    // Boleta
    expect(screen.getByText(/Boleta #123/i)).toBeInTheDocument()

    // Nombres de productos
    expect(screen.getByText('Figura Yujiro Hanma')).toBeInTheDocument()
    expect(screen.getByText('Cosplay Dio')).toBeInTheDocument()

    // Encabezados de la tabla
    expect(screen.getByText('Producto')).toBeInTheDocument()
    expect(screen.getByText('Precio')).toBeInTheDocument()
    expect(screen.getByText('Cantidad')).toBeInTheDocument()
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
  })

  it('debería mostrar el total formateado en CLP', () => {
    const ordenFake = {
      id: 123,
      total: 45000,
      items: []
    }

    renderConOrden(ordenFake)

    expect(screen.getByText(/Total:/i)).toBeInTheDocument()
    // El total se formatea como "$45.000" (con punto de miles)
    expect(screen.getByText(/\$45\.000/)).toBeInTheDocument()
  })

  it('debería usar "Producto #ID" cuando el item no tiene título', () => {
    const ordenFake = {
      id: 456,
      total: 10000,
      items: [
        { id: 99, producto_id: 42, precio_unitario: 10000, cantidad: 1 }
      ]
    }

    renderConOrden(ordenFake)

    // Como no hay `titulo`, debe mostrar "Producto #42"
    expect(screen.getByText('Producto #42')).toBeInTheDocument()
  })
})