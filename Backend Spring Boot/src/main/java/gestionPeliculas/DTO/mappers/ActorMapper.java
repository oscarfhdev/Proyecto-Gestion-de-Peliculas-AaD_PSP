package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.ActorCreateUpdateDTO;
import gestionPeliculas.DTO.ActorDTO;
import gestionPeliculas.domain.Actor;
import org.springframework.stereotype.Component;

@Component
public class ActorMapper {

    // ENTITY -> DTO
    public ActorDTO toDto(Actor actor) {
        if (actor == null) return null;
        return new ActorDTO(
            actor.getId(),
            actor.getNombre()
        );
    }

    // DTO -> ENTITY (para crear)
    public Actor toEntity(ActorCreateUpdateDTO dto) {
        if (dto == null) return null;
        Actor actor = new Actor();
        actor.setNombre(dto.getNombre());
        return actor;
    }

    // UPDATE, se sobreescribe todo
    public void updateEntity(ActorCreateUpdateDTO dto, Actor actor) {
        if (dto == null || actor == null) return;
        actor.setNombre(dto.getNombre());
    }
}
