package com.boostedup.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "DETALLE_BOLETA")
public class DetalleBoleta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer cantidad;
    private BigDecimal precio_unitario;
    private BigDecimal subtotal;

    // Relación Muchos a 1 con Boleta
    @ManyToOne
    @JoinColumn(name = "boleta_id")
    private Boleta boleta;

    // Relación Muchos a 1 con Producto
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    // Genera los Getters y Setters aquí
}