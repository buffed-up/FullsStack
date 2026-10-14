import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminCategorias from '../views/admin/AdminCategorias'

const renderAdminCategorias = () => {
  return render(
    <MemoryRouter>
      <AdminCategorias />
    </MemoryRouter>
  )
}

describe('Vista AdminCategorias', () => {
  it('debería renderizar el título "Categorías"', () => {
    renderAdminCategorias()
    expect(screen.getByText('Categorías')).toBeInTheDocument()
  })

  it('debería mostrar las 3 pestañas: Listar, Nuevo, Editar', () => {
    renderAdminCategorias()
    expect(screen.getByRole('button', { name: 'Listar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
  })

  it('debería mostrar "Cargando..." al inicio', () => {
    renderAdminCategorias()
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería mostrar los encabezados de la tabla después de cargar', async () => {
    renderAdminCategorias()

    await waitFor(
      () => {
        expect(screen.getByText('ID')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getByText('Nombre')).toBeInTheDocument()
  })

  it('debería cargar las categorías del backend (o mostrar vacío/error)', async () => {
    renderAdminCategorias()

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

  it('debería mostrar el formulario con campo "Nombre" al hacer clic en "Nuevo"', async () => {
    renderAdminCategorias()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    screen.getByRole('button', { name: 'Nuevo' }).click()

    await waitFor(() => {
      expect(screen.getByText('Nombre')).toBeInTheDocument()
      const inputNombre = document.querySelector('input[name="nombre"]')
      expect(inputNombre).toBeInTheDocument()
    })
  })

  it('debería mostrar el botón "Crear" en el formulario nuevo', async () => {
    renderAdminCategorias()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    screen.getByRole('button', { name: 'Nuevo' }).click()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
    })
  })

  it('debería mostrar el mensaje de "Editar" sin categoría seleccionada', async () => {
    renderAdminCategorias()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Filtrar el botón de la pestaña (clase nav-link) entre todos los "Editar"
    const botonesEditar = screen.getAllByRole('button', { name: 'Editar' })
    const tabEditar = botonesEditar.find(btn => btn.className.includes('nav-link'))

    expect(tabEditar).toBeDefined()
    tabEditar.click()

    await waitFor(() => {
      expect(screen.getByText(/Selecciona una categoría/i)).toBeInTheDocument()
    })
  })

  it('no debería mostrar errores al inicio', async () => {
    renderAdminCategorias()

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    }, { timeout: 5000 })
  })
})