package com.ofhcinema.GestionCine.dto.create;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DirectorCreateDTO {

    @NotBlank(message = "El nombre del director es obligatorio")
    private String nombre;
}
