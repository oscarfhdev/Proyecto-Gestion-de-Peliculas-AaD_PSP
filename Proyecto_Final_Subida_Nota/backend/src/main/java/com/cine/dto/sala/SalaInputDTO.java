package com.cine.dto.sala;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SalaInputDTO(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @Min(value = 1, message = "La capacidad debe ser al menos 1") int capacidad,
        @NotNull(message = "El tipo de sala es obligatorio") String tipo,
        @Min(value = 1, message = "Debe tener al menos 1 fila") int filas,
        @Min(value = 1, message = "Debe tener al menos 1 asiento por fila") int asientosPorFila) {}
