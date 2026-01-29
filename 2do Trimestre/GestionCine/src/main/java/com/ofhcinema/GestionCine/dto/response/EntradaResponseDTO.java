package com.ofhcinema.GestionCine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntradaResponseDTO {
    private Long id;
    private String codigo;
    private Integer fila;
    private Integer asiento;
    private String estado;
    private Long ventaId;
    private String peliculaTitulo;
    private LocalDateTime funcionFechaHora;
}
