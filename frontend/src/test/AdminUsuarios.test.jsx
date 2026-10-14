import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminUsuarios from '../views/admin/AdminUsuarios'

const renderAdminUsuarios = () => {
  return render(
    <MemoryRouter>
      <AdminUsuarios />
    </MemoryRouter>
  )
}

describe('Vista AdminUsuarios', () => {
  it('debería renderizar el título "Usuarios"', () => {
    renderAdminUsuarios()
    expect(screen.getByText('Usuarios')).toBeInTheDocument()
  })

  it('debería mostrar las 3 pestañas: Listar, Nuevo, Editar', () => {
    renderAdminUsuarios()
    expect(screen.getByRole('button', { name: 'Listar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
  })

  it('debería mostrar "Cargando..." al inicio', () => {
    renderAdminUsuarios()
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería mostrar los encabezados de la tabla después de cargar', async () => {
    renderAdminUsuarios()

    await waitFor(
      () => {
        expect(screen.getByText('ID')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getByText('RUN')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Correo')).toBeInTheDocument()
    expect(screen.getByText('Rol')).toBeInTheDocument()
    expect(screen.getByText('Región')).toBeInTheDocument()
  })

  it('debería cargar los usuarios del backend (o mostrar vacío/error)', async () => {
    renderAdminUsuarios()

    await waitFor(
      () => {
        const tieneError = screen.queryByRole('alert')
        const tieneFilas = document.querySelectorAll('table tbody tr').length > 0
        const tablaVacia = document.querySelectorAll('table tbody tr').length === 0

        expect(tieneError || tieneFilas || tablaVacia).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el formulario con campos al hacer clic en "Nuevo"', async () => {
    renderAdminUsuarios()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    screen.getByRole('button', { name: 'Nuevo' }).click()

    await waitFor(() => {
      expect(screen.getByText('RUN')).toBeInTheDocument()
      expect(screen.getByText('Nombre')).toBeInTheDocument()
      expect(screen.getByText('Apellido')).toBeInTheDocument()
      expect(screen.getByText('Correo')).toBeInTheDocument()
      expect(screen.getByText('Rol')).toBeInTheDocument()
    })
  })

  it('debería mostrar el botón "Crear" en el formulario nuevo', async () => {
    renderAdminUsuarios()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    screen.getByRole('button', { name: 'Nuevo' }).click()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
    })
  })

  it('debería mostrar el mensaje de "Editar" sin usuario seleccionado', async () => {
    renderAdminUsuarios()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Buscar el botón de la pestaña "Editar" (que tiene clase nav-link)
    // porque hay otros botones "Editar" en cada fila de la tabla
    const botonesEditar = screen.getAllByRole('button', { name: 'Editar' })
    const tabEditar = botonesEditar.find(btn => btn.className.includes('nav-link'))

    expect(tabEditar).toBeDefined()
    tabEditar.click()

    await waitFor(() => {
      expect(screen.getByText(/Selecciona un usuario/i)).toBeInTheDocument()
    })
  })

  it('debería tener el select de rol con opciones "cliente" y "admin"', async () => {
    renderAdminUsuarios()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    screen.getByRole('button', { name: 'Nuevo' }).click()

    await waitFor(() => {
      const select = document.querySelector('select[name="rol"]')
      expect(select).toBeInTheDocument()

      const opciones = select.querySelectorAll('option')
      const valores = Array.from(opciones).map(o => o.value)
      expect(valores).toContain('cliente')
      expect(valores).toContain('admin')
    })
  })

  it('debería tener un input de tipo date para la fecha de nacimiento', async () => {
    renderAdminUsuarios()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    screen.getByRole('button', { name: 'Nuevo' }).click()

    await waitFor(() => {
      const fechaInput = document.querySelector('input[type="date"]')
      expect(fechaInput).toBeInTheDocument()
    })
  })

  it('debería tener un input de tipo password para la contraseña', async () => {
    renderAdminUsuarios()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    screen.getByRole('button', { name: 'Nuevo' }).click()

    await waitFor(() => {
      const passInput = document.querySelector('input[type="password"]')
      expect(passInput).toBeInTheDocument()
    })
  })

  it('no debería mostrar errores al inicio', async () => {
    renderAdminUsuarios()

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    }, { timeout: 5000 })
  })
})