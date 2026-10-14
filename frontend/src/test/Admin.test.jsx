import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Admin from '../views/admin/Admin'

// Helper: renderiza Admin en una ruta con un "home" para verificar redirecciones
const renderAdmin = () => {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<div>HOME PAGE</div>} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Vista Admin (layout)', () => {
  describe('sin usuario logueado', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('debería redirigir a "/" si no hay usuario', () => {
      renderAdmin()
      // Si redirige, se ve el "HOME PAGE"
      expect(screen.getByText('HOME PAGE')).toBeInTheDocument()
    })

    it('no debería mostrar el panel de administración sin usuario', () => {
      renderAdmin()
      expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument()
    })
  })

  describe('con usuario cliente (no admin)', () => {
    beforeEach(() => {
      localStorage.setItem('usuario', JSON.stringify({
        id: 2,
        nombre: 'Cliente',
        apellido: 'Test',
        rol: 'cliente'
      }))
    })

    it('debería redirigir a "/" si el usuario no es admin', () => {
      renderAdmin()
      expect(screen.getByText('HOME PAGE')).toBeInTheDocument()
    })

    it('no debería mostrar el panel de administración si es cliente', () => {
      renderAdmin()
      expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument()
    })
  })

  describe('con usuario admin', () => {
    beforeEach(() => {
      localStorage.setItem('usuario', JSON.stringify({
        id: 1,
        nombre: 'Fernando',
        apellido: 'Brana',
        rol: 'admin'
      }))
    })

    it('debería renderizar el título "Panel de administración"', () => {
      renderAdmin()
      expect(screen.getByText('Panel de administración')).toBeInTheDocument()
    })

    it('debería mostrar el saludo con el nombre del admin', () => {
      renderAdmin()
      expect(screen.getByText(/Bienvenido, Fernando Brana/i)).toBeInTheDocument()
    })

    it('debería mostrar el texto informativo', () => {
      renderAdmin()
      expect(screen.getByText(/Aquí irá el CRUD/i)).toBeInTheDocument()
    })

    it('no debería redirigir a "/" si es admin', () => {
      renderAdmin()
      expect(screen.queryByText('HOME PAGE')).not.toBeInTheDocument()
    })
  })
})