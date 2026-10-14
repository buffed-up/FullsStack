import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AdminPerfil from '../views/admin/AdminPerfil'

const renderAdminPerfil = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminPerfil />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Vista AdminPerfil', () => {
  beforeEach(() => {
    localStorage.setItem('usuario', JSON.stringify({
      id: 1,
      run: '11111111-1',
      nombre: 'Fernando',
      apellido: 'Brana',
      correo: 'fernando@test.cl',
      fecha_nacimiento: '1995-05-15T00:00:00.000Z',
      rol: 'admin',
      region: 'Metropolitana',
      comuna: 'Santiago',
      direccion: 'Av. Siempre Viva 123'
    }))
  })

  describe('modo vista (no editando)', () => {
    it('debería renderizar el título "Perfil"', () => {
      renderAdminPerfil()
      expect(screen.getByText('Perfil')).toBeInTheDocument()
    })

    it('debería mostrar el botón "Editar"', () => {
      renderAdminPerfil()
      expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
    })

    it('debería mostrar el RUN del usuario', () => {
      renderAdminPerfil()
      expect(screen.getByText('11111111-1')).toBeInTheDocument()
    })

    it('debería mostrar el nombre completo del usuario', () => {
      renderAdminPerfil()
      expect(screen.getByText(/Fernando Brana/)).toBeInTheDocument()
    })

    it('debería mostrar el correo del usuario', () => {
      renderAdminPerfil()
      expect(screen.getByText('fernando@test.cl')).toBeInTheDocument()
    })

    it('debería mostrar el rol del usuario', () => {
      renderAdminPerfil()
      expect(screen.getAllByText('admin').length).toBeGreaterThan(0)
    })

    it('debería mostrar la región y comuna', () => {
      renderAdminPerfil()
      expect(screen.getByText('Metropolitana')).toBeInTheDocument()
      expect(screen.getByText('Santiago')).toBeInTheDocument()
    })

    it('debería mostrar la dirección', () => {
      renderAdminPerfil()
      expect(screen.getByText('Av. Siempre Viva 123')).toBeInTheDocument()
    })

    it('debería mostrar "—" para campos vacíos', () => {
      localStorage.setItem('usuario', JSON.stringify({
        id: 1,
        nombre: 'Test',
        apellido: 'User',
        correo: 'test@test.cl',
        rol: 'admin'
      }))
      renderAdminPerfil()
      const guiones = screen.getAllByText('—')
      expect(guiones.length).toBeGreaterThan(0)
    })

    it('no debería mostrar formulario de edición', () => {
      renderAdminPerfil()
      expect(screen.queryByRole('button', { name: /Guardar cambios/i })).not.toBeInTheDocument()
    })
  })

  describe('modo edición (al hacer clic en "Editar")', () => {
    it('debería mostrar el formulario de edición al hacer clic en "Editar"', async () => {
      renderAdminPerfil()
      fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Guardar cambios/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
      })
    })

    it('debería mostrar los campos del formulario en modo edición', async () => {
      renderAdminPerfil()
      fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

      await waitFor(() => {
        expect(screen.getByText('RUN')).toBeInTheDocument()
        expect(screen.getByText('Nombre')).toBeInTheDocument()
        expect(screen.getByText('Apellido')).toBeInTheDocument()
        expect(screen.getByText('Correo')).toBeInTheDocument()
        expect(screen.getByText('Rol')).toBeInTheDocument()
      })
    })

    it('debería tener un select de rol con opciones cliente/admin', async () => {
      renderAdminPerfil()
      fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

      await waitFor(() => {
        const select = document.querySelector('select[name="rol"]')
        expect(select).toBeInTheDocument()
      })

      const select = document.querySelector('select[name="rol"]')
      const opciones = Array.from(select.querySelectorAll('option')).map(o => o.value)
      expect(opciones).toContain('cliente')
      expect(opciones).toContain('admin')
    })

    it('debería tener un input de tipo date para fecha de nacimiento', async () => {
      renderAdminPerfil()
      fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

      await waitFor(() => {
        const fechaInput = document.querySelector('input[type="date"]')
        expect(fechaInput).toBeInTheDocument()
      })
    })

    it('debería tener un input de tipo password para la nueva contraseña', async () => {
      renderAdminPerfil()
      fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

      await waitFor(() => {
        const passInput = document.querySelector('input[type="password"]')
        expect(passInput).toBeInTheDocument()
      })
    })

    it('debería volver al modo vista al hacer clic en "Cancelar"', async () => {
      renderAdminPerfil()
      fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Guardar cambios/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /Guardar cambios/i })).not.toBeInTheDocument()
      })
    })
  })
})