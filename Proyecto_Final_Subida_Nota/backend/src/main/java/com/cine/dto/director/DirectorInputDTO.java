package com.cine.dto.director;

import jakarta.validation.constraints.NotBlank;

public record DirectorInputDTO(
        @NotBlank(message = "El nombre no puede estar vacío") String nombre) {}
