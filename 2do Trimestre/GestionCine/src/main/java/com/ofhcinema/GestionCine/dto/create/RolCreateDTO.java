package com.ofhcinema.GestionCine.dto.create;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RolCreateDTO {

    @NotBlank(message = "El nombre del rol es obligatorio")
    private String nombre;
}
