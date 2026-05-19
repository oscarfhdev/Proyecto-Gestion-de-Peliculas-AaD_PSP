package com.cine.dto.funcion;

import java.time.LocalDateTime;

public record FuncionOutputDTO(
        Long id, LocalDateTime fechaHora, double precio,
        Long peliculaId, String peliculaTitulo,
        Long salaId, String salaNombre, int asientosDisponibles,
        int salaCapacidad, int salaFilas, int salaAsientosPorFila) {}
