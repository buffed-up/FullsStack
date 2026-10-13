import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CarritoProvider } from '../context/CarritoContext'
import { AuthProvider } from '../context/AuthContext'
import Carrito from '../views/productos/Carrito'

const renderConProviders = (componente) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>{componente}</CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Vista Carrito (integración con backend real)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debería renderizar el título "Mi carrito de compras"', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('Mi carrito de compras')).toBeInTheDocument()
  })

  it('debería mostrar el carrito vacío al inicio', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
  })

  it('debería mostrar el TOTAL en $0 al inicio', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('TOTAL:')).toBeInTheDocument()
    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('debería mostrar el campo de cupón de descuento', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('Ingrese su cupón de descuento')).toBeInTheDocument()
  })

  it('debería mostrar el botón "PAGAR"', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('PAGAR')).toBeInTheDocument()
  })

  it('debería mostrar el botón "APLICAR" para el cupón', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('APLICAR')).toBeInTheDocument()
  })
})