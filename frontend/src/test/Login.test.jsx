import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from '../views/login/Login'

const renderConProviders = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Vista Login', () => {
  it('debería renderizar el título "Iniciar sesión"', () => {
    renderConProviders()
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  it('debería mostrar el campo "Correo"', () => {
    renderConProviders()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('debería mostrar el campo "Contraseña" de tipo password', () => {
    renderConProviders()
    expect(screen.getByText('Contraseña')).toBeInTheDocument()
    const inputs = document.querySelectorAll('input[type="password"]')
    expect(inputs.length).toBe(1)
  })

  it('debería mostrar el botón "Ingresar"', () => {
    renderConProviders()
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })

  it('debería mostrar el link "Regístrate"', () => {
    renderConProviders()
    expect(screen.getByText('Regístrate')).toBeInTheDocument()
  })

  it('debería mostrar el texto "¿No tienes cuenta?"', () => {
    renderConProviders()
    expect(screen.getByText(/¿No tienes cuenta\?/i)).toBeInTheDocument()
  })

  it('no debería mostrar ningún mensaje de error al inicio', () => {
    renderConProviders()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})