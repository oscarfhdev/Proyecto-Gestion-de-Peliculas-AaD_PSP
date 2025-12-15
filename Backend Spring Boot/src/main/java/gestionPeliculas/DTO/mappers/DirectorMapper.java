package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.DirectorCreateUpdateDTO;
import gestionPeliculas.DTO.DirectorDTO;
import gestionPeliculas.domain.Director;
import org.springframework.stereotype.Component;

@Component
public class DirectorMapper {

    // ENTITY -> DTO
    public DirectorDTO toDto(Director director) {
        if (director == null) return null;
        return new DirectorDTO(
            director.getId(),
            director.getNombre()
        );
    }

    // DTO -> ENTITY (para crear)
    public Director toEntity(DirectorCreateUpdateDTO dto) {
        if (dto == null) return null;
        Director director = new Director();
        director.setNombre(dto.getNombre());
        return director;
    }

    // UPDATE, se sobreescribe todo
    public void updateEntity(DirectorCreateUpdateDTO dto, Director director) {
        if (dto == null || director == null) return;
        director.setNombre(dto.getNombre());
    }

}