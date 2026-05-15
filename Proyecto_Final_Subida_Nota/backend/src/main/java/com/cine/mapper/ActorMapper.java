package com.cine.mapper;

import com.cine.dto.actor.ActorInputDTO;
import com.cine.dto.actor.ActorOutputDTO;
import com.cine.modelo.Actor;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ActorMapper {
    ActorOutputDTO toDTO(Actor actor);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "peliculas", ignore = true)
    Actor toEntity(ActorInputDTO actorInputDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "peliculas", ignore = true)
    void update(ActorInputDTO actorInputDTO, @MappingTarget Actor actor);
}
