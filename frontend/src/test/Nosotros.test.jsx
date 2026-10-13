import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Nosotros from '../views/pagina/Nosotros'

const renderConRouter = (componente) => {
  return render(<BrowserRouter>{componente}</BrowserRouter>)
}

describe('Vista Nosotros', () => {
  it('debería renderizar el título "SOBRE NOSOTROS"', () => {
    renderConRouter(<Nosotros />)
    expect(screen.getByText('SOBRE NOSOTROS')).toBeInTheDocument()
  })

  it('debería mostrar el subtítulo "Nacimos en 2026"', () => {
    renderConRouter(<Nosotros />)
    expect(screen.getByText('Nacimos en 2026')).toBeInTheDocument()
  })

  it('debería mostrar las secciones de Misión, Visión y Valores', () => {
    renderConRouter(<Nosotros />)
    expect(screen.getByText('Nuestra Misión')).toBeInTheDocument()
    expect(screen.getByText('Nuestra Visión')).toBeInTheDocument()
    expect(screen.getByText('Nuestros Valores')).toBeInTheDocument()
  })

  it('debería mostrar la sección "¿Por qué elegirnos?"', () => {
    renderConRouter(<Nosotros />)
    expect(screen.getByText('¿Por qué elegirnos?')).toBeInTheDocument()
  })
})