package com.boostedup.backend.controller;

import com.boostedup.backend.model.Producto;
import com.boostedup.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173") // Permite que React (Vite) se conecte
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // Esta es la ruta que React va a llamar: http://localhost:8080/api/productos
    @GetMapping
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }
}