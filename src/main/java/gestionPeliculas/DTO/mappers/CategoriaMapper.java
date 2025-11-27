package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.CategoriaCreateUpdateDTO;
import gestionPeliculas.DTO.CategoriaDTO;
import gestionPeliculas.domain.Categoria;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {
    // ENTITY -> DTO
    public CategoriaDTO toDto(Categoria categoria) {
        if (categoria == null) return null;
        return new CategoriaDTO(
                categoria.getId(),
                categoria.getNombre()
        );
    }

    // DTO -> ENTITY (crear)
    public Categoria toEntity(CategoriaCreateUpdateDTO dto) {
        if (dto == null) return null;
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        return categoria;
    }

    // UPDATE
    public void updateEntity(CategoriaCreateUpdateDTO dto, Categoria categoria) {
        if (dto == null || categoria == null) return;
        categoria.setNombre(dto.getNombre());
    }
}
