import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Blogs from '../views/Blogs'

const renderConRouter = (componente) => {
  return render(<BrowserRouter>{componente}</BrowserRouter>)
}

describe('Vista Blogs', () => {
  it('debería renderizar el título "BITÁCORA RETRO"', () => {
    renderConRouter(<Blogs />)
    expect(screen.getByText('BITÁCORA RETRO')).toBeInTheDocument()
  })

  it('debería mostrar el subtítulo "Noticias, guías y cultura de colección"', () => {
    renderConRouter(<Blogs />)
    expect(screen.getByText('Noticias, guías y cultura de colección')).toBeInTheDocument()
  })

  it('debería mostrar un mensaje de carga o vacío', () => {
    renderConRouter(<Blogs />)
    expect(
      screen.getByText(/Cargando blogs|No hay blogs disponibles|No se pudieron cargar/i)
    ).toBeInTheDocument()
  })
})