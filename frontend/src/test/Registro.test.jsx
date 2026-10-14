import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Registro from '../views/login/Registro'

const renderConProviders = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Registro />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Vista Registro', () => {
  it('debería renderizar el título "Crear cuenta"', () => {
    renderConProviders()
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument()
  })

  it('debería mostrar los campos personales (RUN, Nombre, Apellido)', () => {
    renderConProviders()
    expect(screen.getByText('RUN')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Apellido')).toBeInTheDocument()
  })

  it('debería mostrar el campo "Fecha de nacimiento"', () => {
    renderConProviders()
    expect(screen.getByText('Fecha de nacimiento')).toBeInTheDocument()
    const fechaInput = document.querySelector('input[type="date"]')
    expect(fechaInput).toBeInTheDocument()
  })

  it('debería mostrar los campos de contacto (Correo, Contraseña)', () => {
    renderConProviders()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByText('Contraseña')).toBeInTheDocument()

    const emailInput = document.querySelector('input[type="email"]')
    const passInput = document.querySelector('input[type="password"]')
    expect(emailInput).toBeInTheDocument()
    expect(passInput).toBeInTheDocument()
  })

  it('debería mostrar los campos de ubicación (Región, Comuna, Dirección)', () => {
    renderConProviders()
    expect(screen.getByText('Región')).toBeInTheDocument()
    expect(screen.getByText('Comuna')).toBeInTheDocument()
    expect(screen.getByText('Dirección')).toBeInTheDocument()
  })

  it('debería mostrar el botón "Registrarme"', () => {
    renderConProviders()
    expect(screen.getByRole('button', { name: 'Registrarme' })).toBeInTheDocument()
  })

  it('debería mostrar el link "Inicia sesión"', () => {
    renderConProviders()
    expect(screen.getByText('Inicia sesión')).toBeInTheDocument()
  })

  it('debería mostrar el texto "¿Ya tienes cuenta?"', () => {
    renderConProviders()
    expect(screen.getByText(/¿Ya tienes cuenta\?/i)).toBeInTheDocument()
  })

  it('no debería mostrar ningún mensaje de error al inicio', () => {
    renderConProviders()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('debería tener 9 campos de texto en el formulario', () => {
    renderConProviders()
    // RUN, Fecha, Nombre, Apellido, Correo, Contraseña, Región, Comuna, Dirección
    // Fecha es input[type="date"], no cuenta como textbox normal
    const inputs = document.querySelectorAll('input')
    expect(inputs.length).toBe(9)
  })
})