import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AdminDashboard from '../views/admin/AdminDashboard'

const renderConProviders = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminDashboard />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Vista AdminDashboard', () => {
  beforeEach(() => {
    // Simulamos un admin logueado
    // ⚠️ AJUSTA la clave 'usuario' si tu AuthContext usa otra
    localStorage.setItem('usuario', JSON.stringify({
      id: 1,
      nombre: 'Fernando',
      apellido: 'Brana',
      rol: 'admin'
    }))
  })

  it('debería renderizar el título "Dashboard"', () => {
    renderConProviders()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('debería mostrar el saludo con el nombre del usuario', () => {
    renderConProviders()
    expect(screen.getByText(/Bienvenido, Fernando Brana/i)).toBeInTheDocument()
  })

  it('debería mostrar la sección "Productos"', () => {
    renderConProviders()
    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Administrar los productos disponibles')).toBeInTheDocument()
  })

  it('debería mostrar la sección "Categorías"', () => {
    renderConProviders()
    expect(screen.getByText('Categorías')).toBeInTheDocument()
    expect(screen.getByText('Organizar productos por categoría')).toBeInTheDocument()
  })

  it('debería mostrar la sección "Usuarios"', () => {
    renderConProviders()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Gestión de usuarios y sus roles')).toBeInTheDocument()
  })

  it('debería mostrar la sección "Órdenes"', () => {
    renderConProviders()
    expect(screen.getByText('Órdenes')).toBeInTheDocument()
    expect(screen.getByText('Seguimiento de las compras realizadas')).toBeInTheDocument()
  })

  it('debería mostrar la sección "Reportes"', () => {
    renderConProviders()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
    expect(screen.getByText('Información detallada del sistema')).toBeInTheDocument()
  })

  it('debería mostrar la sección "Perfil"', () => {
    renderConProviders()
    expect(screen.getByText('Perfil')).toBeInTheDocument()
    expect(screen.getByText('Información personal y configuración')).toBeInTheDocument()
  })

  it('debería mostrar la sección "Productos críticos"', () => {
    renderConProviders()
    expect(screen.getByText('Productos críticos')).toBeInTheDocument()
    expect(screen.getByText('Productos con stock bajo')).toBeInTheDocument()
  })

  it('debería tener 7 tarjetas (una por sección)', () => {
    renderConProviders()
    const tarjetas = document.querySelectorAll('.vapor-card')
    expect(tarjetas.length).toBe(7)
  })

  it('debería tener 7 links que empiecen con /admin/', () => {
    renderConProviders()
    const links = document.querySelectorAll('a[href^="/admin/"]')
    expect(links.length).toBe(7)
  })
})