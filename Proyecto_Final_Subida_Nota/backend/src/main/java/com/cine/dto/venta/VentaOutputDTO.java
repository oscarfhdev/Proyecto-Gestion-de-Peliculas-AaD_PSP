package com.cine.dto.venta;

import com.cine.dto.entrada.EntradaOutputDTO;
import java.time.LocalDateTime;
import java.util.Set;

public record VentaOutputDTO(
        Long id, LocalDateTime fecha, double importeTotal, String metodoPago,
        String estado, String creadoPor, Set<EntradaOutputDTO> entradas, Long usuarioId) {}
