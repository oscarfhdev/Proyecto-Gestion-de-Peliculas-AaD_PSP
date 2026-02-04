package com.ofhcinema.GestionCine.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entradas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private Integer fila;

    @Column(nullable = false)
    private Integer asiento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEntrada estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcion_id", nullable = false)
    private Funcion funcion;

    public Entrada(String codigo, Integer fila, Integer asiento, EstadoEntrada estado, Venta venta, Funcion funcion) {
        this.codigo = codigo;
        this.fila = fila;
        this.asiento = asiento;
        this.estado = estado;
        this.venta = venta;
        this.funcion = funcion;
    }
}
