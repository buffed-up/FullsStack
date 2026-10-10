import { Routes, Route } from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Index from './views/Index'
import Productos from './views/Productos'
import ProductoDetalle from './views/ProductoDetalle'
import Carrito from './views/Carrito'
import Login from './views/Login'
import Registro from './views/Registro'
import Admin from './views/Admin'

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App