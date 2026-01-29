package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Actor;
import com.ofhcinema.GestionCine.domain.Pelicula;
import com.ofhcinema.GestionCine.dto.create.PeliculaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.PeliculaResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PeliculaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "director", ignore = true)
    @Mapping(target = "actores", ignore = true)
    @Mapping(target = "funciones", ignore = true)
    Pelicula toEntity(PeliculaCreateDTO dto);

    @Mapping(source = "director.nombre", target = "directorNombre")
    @Mapping(source = "actores", target = "actoresNombres", qualifiedByName = "actoresToNames")
    PeliculaResponseDTO toResponseDTO(Pelicula entity);

    List<PeliculaResponseDTO> toResponseDTOList(List<Pelicula> entities);

    @Named("actoresToNames")
    default Set<String> actoresToNames(Set<Actor> actores) {
        if (actores == null) {
            return null;
        }
        return actores.stream()
                .map(Actor::getNombre)
                .collect(Collectors.toSet());
    }
}
