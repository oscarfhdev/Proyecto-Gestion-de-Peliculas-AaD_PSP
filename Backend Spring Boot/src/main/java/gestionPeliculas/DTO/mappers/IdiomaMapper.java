package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.IdiomaCreateUpdateDTO;
import gestionPeliculas.DTO.IdiomaDTO;
import gestionPeliculas.domain.Idioma;
import org.springframework.stereotype.Component;

@Component
public class IdiomaMapper {

    // ENTITY -> DTO
    public IdiomaDTO toDto(Idioma idioma) {
        if (idioma == null) return null;
        return new IdiomaDTO(idioma.getId(), idioma.getNombre());
    }

    // DTO -> ENTITY (crear)
    public Idioma toEntity(IdiomaCreateUpdateDTO dto) {
        if (dto == null) return null;
        Idioma idioma = new Idioma();
        idioma.setNombre(dto.getNombre());
        return idioma;
    }

    // Actualizar entidad existente
    public void updateEntity(IdiomaCreateUpdateDTO dto, Idioma idioma) {
        if (dto == null || idioma == null) return;
        idioma.setNombre(dto.getNombre());
    }
}
