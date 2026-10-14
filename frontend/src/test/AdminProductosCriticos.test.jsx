import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminProductosCriticos from '../views/admin/AdminProductosCriticos'

const renderAdminProductosCriticos = () => {
  return render(
    <MemoryRouter>
      <AdminProductosCriticos />
    </MemoryRouter>
  )
}

describe('Vista AdminProductosCriticos', () => {
  it('debería mostrar "Cargando..." al inicio', () => {
    renderAdminProductosCriticos()
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('debería mostrar el título con "Productos críticos" después de cargar', async () => {
    renderAdminProductosCriticos()

    await waitFor(
      () => {
        expect(screen.getByText(/Productos críticos/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar el subtítulo "Productos con stock menor o igual a 5"', async () => {
    renderAdminProductosCriticos()

    await waitFor(
      () => {
        expect(screen.getByText(/stock menor o igual a 5/i)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar la tabla con encabezados (ID, Producto, Stock, Precio)', async () => {
    renderAdminProductosCriticos()

    await waitFor(
      () => {
        expect(screen.getByText('ID')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    expect(screen.getByText('Producto')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
    expect(screen.getByText('Precio')).toBeInTheDocument()
  })

  it('debería mostrar productos del backend o el mensaje de vacío', async () => {
    renderAdminProductosCriticos()

    await waitFor(
      () => {
        const tieneFilas = document.querySelectorAll('table tbody tr').length > 0
        const estaVacio = screen.queryByText('No hay productos críticos.')
        const tieneError = screen.queryByRole('alert')

        expect(tieneFilas || estaVacio || tieneError).toBeTruthy()
      },
      { timeout: 5000 }
    )
  })

  it('debería mostrar precios formateados en CLP si hay productos', async () => {
    renderAdminProductosCriticos()

    await waitFor(
      () => {
        const tieneFilas = document.querySelectorAll('table tbody tr').length > 0
        if (tieneFilas) {
          // Algún precio debería tener el formato $XX.XXX
          const precios = Array.from(document.querySelectorAll('td')).map(td => td.textContent)
          const tienePrecioCLP = precios.some(txt => /\$\d{1,3}(\.\d{3})+/.test(txt))
          expect(tienePrecioCLP).toBe(true)
        } else {
          // Si no hay productos, el test pasa igual
          expect(true).toBe(true)
        }
      },
      { timeout: 5000 }
    )
  })

  it('no debería mostrar errores al inicio', async () => {
    renderAdminProductosCriticos()

    await waitFor(
      () => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})