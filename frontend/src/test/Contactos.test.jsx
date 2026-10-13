import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Contactos from '../views/pagina/Contactos'

const renderConRouter = (componente) => {
  return render(<BrowserRouter>{componente}</BrowserRouter>)
}

describe('Vista Contactos', () => {
  it('debería renderizar el título de ayuda', () => {
    renderConRouter(<Contactos />)
    expect(screen.getByText('¿NECESITAS AYUDA, JUGADOR?')).toBeInTheDocument()
  })

  it('debería mostrar el encabezado del formulario "ENVÍANOS UN MENSAJE"', () => {
    renderConRouter(<Contactos />)
    expect(screen.getByText('ENVÍANOS UN MENSAJE')).toBeInTheDocument()
  })

  it('debería mostrar los campos del formulario', () => {
    renderConRouter(<Contactos />)
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Motivo de la consulta')).toBeInTheDocument()
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument()
  })

  it('debería mostrar el botón "Enviar Mensaje"', () => {
    renderConRouter(<Contactos />)
    expect(screen.getByText('Enviar Mensaje')).toBeInTheDocument()
  })
})