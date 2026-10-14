import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PagoError from '../views/productos/PagoError'

const renderConMensaje = (mensaje = null) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/pago-error', state: mensaje ? { mensaje } : null }]}>
      <PagoError />
    </MemoryRouter>
  )
}

describe('Vista PagoError', () => {
  it('debería mostrar el título "No se pudo realizar el pago"', () => {
    renderConMensaje()
    expect(screen.getByText(/No se pudo realizar el pago/i)).toBeInTheDocument()
  })

  it('debería mostrar el mensaje por defecto si no hay state', () => {
    renderConMensaje(null)
    expect(screen.getByText('No se pudo completar el pago.')).toBeInTheDocument()
  })

  it('debería mostrar el mensaje personalizado si viene en el state', () => {
    renderConMensaje('Tarjeta rechazada por el banco.')
    expect(screen.getByText('Tarjeta rechazada por el banco.')).toBeInTheDocument()
  })

  it('debería mostrar el botón "Volver al carrito"', () => {
    renderConMensaje()
    expect(screen.getByText('Volver al carrito')).toBeInTheDocument()
  })

  it('debería mostrar el botón "Ver productos"', () => {
    renderConMensaje()
    expect(screen.getByText('Ver productos')).toBeInTheDocument()
  })
})