package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.CriticaCreateUpdateDTO;
import gestionPeliculas.DTO.CriticaDTO;
import gestionPeliculas.domain.Critica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CriticaMapper {

    @Autowired
    private UsuarioMapper usuarioMapper;

    // ENTITY -> DTO
    public CriticaDTO toDto(Critica critica) {
        if (critica == null) return null;
        CriticaDTO dto = new CriticaDTO();
        dto.setId(critica.getId());
        dto.setComentario(critica.getComentario());
        dto.setNota(critica.getNota());
        dto.setFecha(critica.getFecha());

        // Asignamos el autor directo
        dto.setAutor(critica.getAutor());

        // Mapeamos título de peli si existe
        if (critica.getPelicula() != null) {
            dto.setPeliculaTitulo(critica.getPelicula().getTitulo());
        }
        return dto;
    }

    // DTO -> ENTITY
    public Critica toEntity(CriticaCreateUpdateDTO dto) {
        // ... mapea comentario, nota, fecha

        Critica critica = new Critica();
        // ... setters anteriores

        critica.setAutor(dto.getAutor()); // <--- NUEVO
        return critica;
    }

    // UPDATE
    public void updateEntity(CriticaCreateUpdateDTO dto, Critica critica) {
        // ... setters anteriores
        critica.setAutor(dto.getAutor()); // <--- NUEVO
    }
}
