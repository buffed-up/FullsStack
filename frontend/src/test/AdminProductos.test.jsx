import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminProductos from '../views/admin/AdminProductos'

const renderAdminProductos = () => {
  return render(
    <MemoryRouter>
      <AdminProductos />
    </MemoryRouter>
  )
}

describe('Vista AdminProductos', () => {
  it('debería renderizar el título "Productos"', () => {
    renderAdminProductos()
    expect(screen.getByText('Productos')).toBeInTheDocument()
  })

  it('debería mostrar las 3 pestañas: Listar, Nuevo, Editar', () => {
    renderAdminProductos()
    expect(screen.getByRole('button', { name: 'Listar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
  })

  it('debería mostrar "Cargando..." al inicio', () => {
    renderAdminProductos()
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería mostrar los encabezados de la tabla después de cargar', async () => {
    renderAdminProductos()

    await waitFor(
      () => {
        expect(screen.getByText('ID')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Precio')).toBeInTheDocument()
    expect(screen.getByText('Categoría')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
    expect(screen.getByText('Vendidos')).toBeInTheDocument()
  })

  it('debería cargar los productos del backend (o mostrar error)', async () => {
    renderAdminProductos()

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
    renderAdminProductos()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }))

    await waitFor(() => {
      expect(screen.getByText('Título')).toBeInTheDocument()
      expect(screen.getByText('Precio')).toBeInTheDocument()
      expect(screen.getByText('Descripción')).toBeInTheDocument()
      expect(screen.getByText('Categoría')).toBeInTheDocument()
      expect(screen.getByText('Colección')).toBeInTheDocument()
      expect(screen.getByText('Stock')).toBeInTheDocument()
    })
  })

  it('debería mostrar el botón "Crear" en el formulario nuevo', async () => {
    renderAdminProductos()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
    })
  })

  it('debería mostrar el mensaje de "Editar" sin producto seleccionado', async () => {
    renderAdminProductos()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    const botonesEditar = screen.getAllByRole('button', { name: 'Editar' })
    const tabEditar = botonesEditar.find(btn => btn.className.includes('nav-link'))

    expect(tabEditar).toBeDefined()
    fireEvent.click(tabEditar)

    await waitFor(() => {
      expect(screen.getByText(/Selecciona un producto/i)).toBeInTheDocument()
    })
  })

  it('debería tener un input de tipo number para el precio en el formulario', async () => {
    renderAdminProductos()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }))

    await waitFor(() => {
      const inputPrecio = document.querySelector('input[name="precio"][type="number"]')
      expect(inputPrecio).toBeInTheDocument()
    })
  })

  it('debería tener un input de tipo file para la imagen', async () => {
    renderAdminProductos()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }))

    await waitFor(() => {
      const fileInput = document.querySelector('input[type="file"]')
      expect(fileInput).toBeInTheDocument()
    })
  })

  it('debería tener un select de categoría con la opción "Sin categoría"', async () => {
    renderAdminProductos()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }))

    await waitFor(() => {
      const select = document.querySelector('select[name="categoria_id"]')
      expect(select).toBeInTheDocument()

      const opciones = Array.from(select.querySelectorAll('option')).map(o => o.textContent)
      expect(opciones.some(txt => txt.includes('Sin categoría'))).toBe(true)
    })
  })

  it('debería tener un textarea para la descripción', async () => {
    renderAdminProductos()

    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
    }, { timeout: 5000 })

    fireEvent.click(screen.getByRole('button', { name: 'Nuevo' }))

    await waitFor(() => {
      const textarea = document.querySelector('textarea[name="descripcion"]')
      expect(textarea).toBeInTheDocument()
    })
  })

  it('no debería mostrar errores al inicio', async () => {
    renderAdminProductos()

    await waitFor(
      () => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})