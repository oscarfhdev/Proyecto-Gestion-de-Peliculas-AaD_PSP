package com.ofhcinema.GestionCine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaResponseDTO {
    private Long id;
    private String nombre;
    private Integer capacidad;
}
