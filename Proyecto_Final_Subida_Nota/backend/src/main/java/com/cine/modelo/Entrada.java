package com.cine.modelo;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"funcion", "venta", "butaca"})
@ToString(exclude = {"funcion", "venta", "butaca"})
@EntityListeners(AuditingEntityListener.class)
public class Entrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;
    private int fila;
    private int asiento;

    @Enumerated(EnumType.STRING)
    private EstadoEntrada estado;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime fechaCreacion;

    @CreatedBy
    @Column(updatable = false)
    private String creadoPor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcion_id")
    private Funcion funcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "butaca_id")
    private Butaca butaca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id")
    private Venta venta;
}
