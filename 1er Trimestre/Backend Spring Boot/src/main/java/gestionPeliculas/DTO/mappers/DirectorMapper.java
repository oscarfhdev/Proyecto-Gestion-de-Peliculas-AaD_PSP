package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.DirectorCreateUpdateDTO;
import gestionPeliculas.DTO.DirectorDTO;
import gestionPeliculas.domain.Director;
import org.springframework.stereotype.Component;

@Component
public class DirectorMapper {

    // ENTITY -> DTO
    public DirectorDTO toDto(Director director) {
        if (director == null)
            return null;
        DirectorDTO dto = new DirectorDTO();
        dto.setId(director.getId());
        dto.setNombre(director.getNombre());
        dto.setApellido(director.getApellido());
        dto.setNombreCompleto(director.getNombreCompleto());
        dto.setFotoUrl(director.getFotoUrl());
        dto.setNumeroPeliculas(director.getPeliculas() != null ? director.getPeliculas().size() : 0);
        return dto;
    }

    // DTO -> ENTITY (para crear)
    public Director toEntity(DirectorCreateUpdateDTO dto) {
        if (dto == null)
            return null;
        Director director = new Director();
        director.setNombre(dto.getNombre());
        director.setApellido(dto.getApellido());
        director.setFotoUrl(dto.getFotoUrl());
        return director;
    }

    // UPDATE, se sobreescribe todo
    public void updateEntity(DirectorCreateUpdateDTO dto, Director director) {
        if (dto == null || director == null)
            return;
        director.setNombre(dto.getNombre());
        director.setApellido(dto.getApellido());
        director.setFotoUrl(dto.getFotoUrl());
    }
}