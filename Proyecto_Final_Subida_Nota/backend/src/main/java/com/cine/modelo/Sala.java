package com.cine.modelo;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"funciones", "butacas"})
@ToString(exclude = {"funciones", "butacas"})
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private int capacidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoSala tipo = TipoSala.STANDARD;

    /** Número de filas de butacas */
    private int filas;

    /** Número de asientos por fila */
    private int asientosPorFila;

    @OneToMany(mappedBy = "sala", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Funcion> funciones = new HashSet<>();

    @OneToMany(mappedBy = "sala", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Butaca> butacas = new ArrayList<>();
}
