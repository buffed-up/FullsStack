import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminReportes from '../views/admin/AdminReportes'

const renderAdminReportes = () => {
  return render(
    <MemoryRouter>
      <AdminReportes />
    </MemoryRouter>
  )
}

describe('Vista AdminReportes', () => {
  it('debería mostrar "Cargando reportes..." al inicio', () => {
    renderAdminReportes()
    expect(screen.getByText(/Cargando reportes/i)).toBeInTheDocument()
  })

  it('debería renderizar el título "Reportes" después de cargar', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Reportes')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el bloque de "Ventas totales"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Ventas totales')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el bloque de "Boletas registradas"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Boletas registradas')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar la sección "Boletas por estado"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Boletas por estado')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar la sección "Productos por categoría"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Productos por categoría')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar la sección "Top 10 productos más vendidos"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText(/Top 10 productos más vendidos/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar la sección "Ingresos por mes"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Ingresos por mes')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería tener 4 tablas (una por sección de tabla)', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        const tablas = document.querySelectorAll('table')
        expect(tablas.length).toBe(4)
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar los encabezados de la tabla "Boletas por estado"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Estado')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getAllByText('Cantidad').length).toBeGreaterThan(0)
  })

  it('debería mostrar los encabezados de la tabla "Top 10"', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.getByText('Producto')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getByText(/Unidades vendidas/i)).toBeInTheDocument()
  })

  it('no debería mostrar errores al inicio', async () => {
    renderAdminReportes()

    await waitFor(
      () => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})