package com.ofhcinema.GestionCine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuncionResponseDTO {
    private Long id;
    private LocalDateTime fechaHora;
    private BigDecimal precio;
    private String salaNombre;
    private String peliculaTitulo;
}
