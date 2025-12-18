package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.ActorCreateUpdateDTO;
import gestionPeliculas.DTO.ActorDTO;
import gestionPeliculas.domain.Actor;
import org.springframework.stereotype.Component;

@Component
public class ActorMapper {

    // ENTITY -> DTO
    public ActorDTO toDto(Actor actor) {
        if (actor == null)
            return null;
        ActorDTO dto = new ActorDTO();
        dto.setId(actor.getId());
        dto.setNombre(actor.getNombre());
        dto.setApellido(actor.getApellido());
        dto.setNombreCompleto(actor.getNombreCompleto());
        dto.setFotoUrl(actor.getFotoUrl());
        dto.setNumeroPeliculas(actor.getPeliculas() != null ? actor.getPeliculas().size() : 0);
        return dto;
    }

    // DTO -> ENTITY (para crear)
    public Actor toEntity(ActorCreateUpdateDTO dto) {
        if (dto == null)
            return null;
        Actor actor = new Actor();
        actor.setNombre(dto.getNombre());
        actor.setApellido(dto.getApellido());
        actor.setFotoUrl(dto.getFotoUrl());
        return actor;
    }

    // UPDATE, se sobreescribe todo
    public void updateEntity(ActorCreateUpdateDTO dto, Actor actor) {
        if (dto == null || actor == null)
            return;
        actor.setNombre(dto.getNombre());
        actor.setApellido(dto.getApellido());
        actor.setFotoUrl(dto.getFotoUrl());
    }
}
