package com.ofhcinema.GestionCine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeliculaResponseDTO {
    private Long id;
    private String titulo;
    private Integer duracion;
    private Integer edadMinima;
    private String directorNombre;
    private Set<String> actoresNombres;
}
