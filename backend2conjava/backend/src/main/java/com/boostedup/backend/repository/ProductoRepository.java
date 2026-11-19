package com.boostedup.backend.repository;

import com.boostedup.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Spring Boot hace la magia de la consulta SQL automáticamente
}