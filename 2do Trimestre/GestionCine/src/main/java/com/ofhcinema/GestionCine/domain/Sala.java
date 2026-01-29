package com.ofhcinema.GestionCine.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false)
    private Integer capacidad;

    @OneToMany(mappedBy = "sala", cascade = CascadeType.ALL)
    private List<Funcion> funciones = new ArrayList<>();

    public Sala(String nombre, Integer capacidad) {
        this.nombre = nombre;
        this.capacidad = capacidad;
    }
}
