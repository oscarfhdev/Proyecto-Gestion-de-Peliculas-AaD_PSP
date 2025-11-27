package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.PlataformaCreateUpdateDTO;
import gestionPeliculas.DTO.PlataformaDTO;
import gestionPeliculas.domain.Plataforma;
import org.springframework.stereotype.Component;

@Component
public class PlataformaMapper {

    // ENTITY -> DTO
    public PlataformaDTO toDto(Plataforma plataforma) {
        if (plataforma == null) return null;
        return new PlataformaDTO(plataforma.getId(), plataforma.getNombre(), plataforma.getUrl());
    }

    // DTO -> ENTITY (crear)
    public Plataforma toEntity(PlataformaCreateUpdateDTO dto) {
        if (dto == null) return null;
        Plataforma plataforma = new Plataforma();
        plataforma.setNombre(dto.getNombre());
        plataforma.setUrl(dto.getUrl());
        return plataforma;
    }

    // Actualizar entidad existente
    public void updateEntity(PlataformaCreateUpdateDTO dto, Plataforma plataforma) {
        if (dto == null || plataforma == null) return;
        plataforma.setNombre(dto.getNombre());
        plataforma.setUrl(dto.getUrl());
    }
}
