package com.cine.mapper;

import com.cine.dto.pelicula.PeliculaInputDTO;
import com.cine.dto.pelicula.PeliculaOutputDTO;
import com.cine.modelo.Actor;
import com.cine.modelo.Pelicula;
import org.mapstruct.*;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class PeliculaMapper {
    @Mapping(target = "directorId", source = "director.id")
    @Mapping(target = "directorNombre", source = "director.nombre")
    @Mapping(target = "actorIds", source = "actores", qualifiedByName = "mapActorsToIds")
    public abstract PeliculaOutputDTO toDTO(Pelicula pelicula);

    @Mapping(target = "director", ignore = true)
    @Mapping(target = "actores", ignore = true)
    @Mapping(target = "funciones", ignore = true)
    @Mapping(target = "id", ignore = true)
    public abstract Pelicula toEntity(PeliculaInputDTO peliculaInputDTO);

    @Mapping(target = "director", ignore = true)
    @Mapping(target = "actores", ignore = true)
    @Mapping(target = "funciones", ignore = true)
    @Mapping(target = "id", ignore = true)
    public abstract void update(PeliculaInputDTO peliculaInputDTO, @MappingTarget Pelicula pelicula);

    @Named("mapActorsToIds")
    public Set<Long> mapActorsToIds(Set<Actor> actors) {
        if (actors == null) return Collections.emptySet();
        return actors.stream().map(Actor::getId).collect(Collectors.toSet());
    }
}
