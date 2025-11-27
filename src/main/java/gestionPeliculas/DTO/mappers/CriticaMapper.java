package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.CriticaCreateUpdateDTO;
import gestionPeliculas.domain.Critica;
import org.springframework.stereotype.Component;

@Component
public class CriticaMapper {

    // ENTITY -> DTO
    public CriticaCreateUpdateDTO toDto(Critica critica) {
        if (critica == null) return null;
        CriticaCreateUpdateDTO dto = new CriticaCreateUpdateDTO();
        dto.setComentario(critica.getComentario());
        dto.setNota(critica.getNota());
        dto.setFecha(critica.getFecha());
        return dto;
    }

    // DTO -> ENTITY
    public Critica toEntity(CriticaCreateUpdateDTO dto) {
        if (dto == null) return null;
        Critica critica = new Critica();
        critica.setComentario(dto.getComentario());
        critica.setNota(dto.getNota());
        critica.setFecha(dto.getFecha());
        return critica;
    }

    // UPDATE
    public void updateEntity(CriticaCreateUpdateDTO dto, Critica critica) {
        if (dto == null || critica == null) return;
        critica.setComentario(dto.getComentario());
        critica.setNota(dto.getNota());
        critica.setFecha(dto.getFecha());
    }
}
