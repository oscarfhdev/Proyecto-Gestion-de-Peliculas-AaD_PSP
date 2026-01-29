package com.ofhcinema.GestionCine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaResponseDTO {
    private Long id;
    private LocalDateTime fecha;
    private BigDecimal importeTotal;
    private String metodoPago;
    private String estado;
    private String usuarioEmail;
}
