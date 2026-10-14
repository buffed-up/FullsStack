import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminOrdenes from '../views/admin/AdminOrdenes'

const renderAdminOrdenes = () => {
  return render(
    <MemoryRouter>
      <AdminOrdenes />
    </MemoryRouter>
  )
}

describe('Vista AdminOrdenes', () => {
  it('debería renderizar el título "Boletas"', () => {
    renderAdminOrdenes()
    expect(screen.getByText('Boletas')).toBeInTheDocument()
  })

  it('debería mostrar las 2 pestañas: Listar, Detalle', () => {
    renderAdminOrdenes()
    expect(screen.getByRole('button', { name: 'Listar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Detalle' })).toBeInTheDocument()
  })

  it('debería mostrar "Cargando..." al inicio', () => {
    renderAdminOrdenes()
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería mostrar los encabezados de la tabla después de cargar', async () => {
    renderAdminOrdenes()

    await waitFor(
      () => {
        expect(screen.getByText('Fecha')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getByText('Cliente')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
  })

  it('debería cargar las órdenes del backend (o mostrar vacío/error)', async () => {
    renderAdminOrdenes()

    await waitFor(
      () => {
        const tieneError = screen.queryByRole('alert')
        const tieneFilas = document.querySelectorAll('table tbody tr').length > 0
        const estaVacio = screen.queryByText('No hay boletas registradas.')

        expect(tieneError || tieneFilas || estaVacio).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el mensaje de "Detalle" sin boleta seleccionada', async () => {
    renderAdminOrdenes()

    await waitFor(() => {
      expect(screen.getByText('Fecha')).toBeInTheDocument()
    }, { timeout: 5000 })

    // Buscar el botón "Detalle" entre las tabs
    const botonesDetalle = screen.getAllByRole('button', { name: 'Detalle' })
    const tabDetalle = botonesDetalle.find(btn => btn.className.includes('nav-link'))

    expect(tabDetalle).toBeDefined()
    fireEvent.click(tabDetalle)

    await waitFor(() => {
      expect(screen.getByText(/Selecciona una boleta/i)).toBeInTheDocument()
    })
  })

  it('debería tener botones "Ver" en cada fila de la tabla', async () => {
    renderAdminOrdenes()

    await waitFor(
      () => {
        const botonesVer = screen.queryAllByRole('button', { name: 'Ver' })
        // Si hay órdenes, hay botones "Ver". Si no hay, no hay botones.
        const tieneFilas = document.querySelectorAll('table tbody tr').length > 0
        if (tieneFilas) {
          expect(botonesVer.length).toBeGreaterThan(0)
        } else {
          expect(botonesVer.length).toBe(0)
        }
      },
      { timeout: 5000 }
    )
  })

  it('no debería mostrar errores al inicio', async () => {
    renderAdminOrdenes()

    await waitFor(
      () => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})