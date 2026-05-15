package com.cine.dto.entrada;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record EntradaInputDTO(
        @NotNull(message = "La función es obligatoria") Long funcionId,
        @Min(1) int fila, @Min(1) int asiento) {}
