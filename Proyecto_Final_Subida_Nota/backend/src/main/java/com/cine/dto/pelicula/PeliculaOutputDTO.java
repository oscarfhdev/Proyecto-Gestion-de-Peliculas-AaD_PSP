package com.cine.dto.pelicula;

import java.util.Set;

public record PeliculaOutputDTO(
        Long id, String titulo, String sinopsis, String genero, String imagenUrl,
        int duracion, int edadMinima, Long directorId, String directorNombre, Set<Long> actorIds) {}
