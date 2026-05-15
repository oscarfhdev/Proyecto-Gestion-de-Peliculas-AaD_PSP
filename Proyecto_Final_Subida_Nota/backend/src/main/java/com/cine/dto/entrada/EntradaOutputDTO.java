package com.cine.dto.entrada;

import com.cine.modelo.EstadoEntrada;
import java.time.LocalDateTime;

public record EntradaOutputDTO(
        Long id, String codigo, int fila, int asiento,
        EstadoEntrada estado, Long funcionId, Long ventaId,
        String peliculaTitulo, String peliculaPoster,
        String salaNombre, LocalDateTime fechaHoraFuncion) {}
