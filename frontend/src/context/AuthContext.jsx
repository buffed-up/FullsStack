import { createContext, useContext, useState, useEffect } from 'react'
import React from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuario')
      return guardado ? JSON.parse(guardado) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario))
    } else {
      localStorage.removeItem('usuario')
    }
  }, [usuario])

  const login = (datosUsuario) => setUsuario(datosUsuario)
  const logout = () => setUsuario(null)

  // Actualiza el usuario en memoria (tras editar perfil)
  const actualizarPerfil = (datosNuevos) => {
    setUsuario(prev => prev ? { ...prev, ...datosNuevos } : prev)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, actualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}