package com.cine.mapper;

import com.cine.dto.actor.ActorInputDTO;
import com.cine.dto.actor.ActorOutputDTO;
import com.cine.modelo.Actor;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-21T03:12:49+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class ActorMapperImpl implements ActorMapper {

    @Override
    public ActorOutputDTO toDTO(Actor actor) {
        if ( actor == null ) {
            return null;
        }

        Long id = null;
        String nombre = null;

        id = actor.getId();
        nombre = actor.getNombre();

        ActorOutputDTO actorOutputDTO = new ActorOutputDTO( id, nombre );

        return actorOutputDTO;
    }

    @Override
    public Actor toEntity(ActorInputDTO actorInputDTO) {
        if ( actorInputDTO == null ) {
            return null;
        }

        Actor.ActorBuilder actor = Actor.builder();

        actor.nombre( actorInputDTO.nombre() );

        return actor.build();
    }

    @Override
    public void update(ActorInputDTO actorInputDTO, Actor actor) {
        if ( actorInputDTO == null ) {
            return;
        }

        actor.setNombre( actorInputDTO.nombre() );
    }
}
