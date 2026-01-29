package com.ofhcinema.GestionCine.dto.create;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeliculaCreateDTO {

    @NotBlank(message = "El título de la película es obligatorio")
    private String titulo;

    @NotNull(message = "La duración es obligatoria")
    @Min(value = 1, message = "La duración debe ser al menos 1 minuto")
    private Integer duracion;

    @Min(value = 0, message = "La edad mínima no puede ser negativa")
    private Integer edadMinima;

    private Long directorId;

    private Set<Long> actorIds;
}
