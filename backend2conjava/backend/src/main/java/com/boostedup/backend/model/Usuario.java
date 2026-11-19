package com.boostedup.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "USUARIO") // El nombre exacto de la tabla que creaste en MySQL
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String email;
    private String password;
    private String rol;

    // Relación 1 a Muchos con Boleta
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Boleta> boletas;

    // Genera los Getters y Setters aquí
}