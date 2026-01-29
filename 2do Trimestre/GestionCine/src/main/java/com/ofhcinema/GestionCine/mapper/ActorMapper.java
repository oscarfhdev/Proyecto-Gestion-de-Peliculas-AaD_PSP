package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Actor;
import com.ofhcinema.GestionCine.dto.create.ActorCreateDTO;
import com.ofhcinema.GestionCine.dto.response.ActorResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ActorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "peliculas", ignore = true)
    Actor toEntity(ActorCreateDTO dto);

    ActorResponseDTO toResponseDTO(Actor entity);

    List<ActorResponseDTO> toResponseDTOList(List<Actor> entities);
}
