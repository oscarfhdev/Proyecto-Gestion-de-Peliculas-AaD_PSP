package com.cine.dto.pelicula;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record PeliculaInputDTO(
        @NotBlank(message = "El título es obligatorio") String titulo,
        String sinopsis, String genero, String imagenUrl,
        @Min(value = 1, message = "La duración debe ser mayor a 0") int duracion,
        @Min(value = 0, message = "La edad mínima no puede ser negativa") int edadMinima,
        @NotNull(message = "El director es obligatorio") Long directorId,
        Set<Long> actorIds) {}
