package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.FuncionCreateUpdateDTO;
import gestionPeliculas.DTO.FuncionDTO;
import gestionPeliculas.domain.Funcion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FuncionMapper {

    @Autowired
    private PeliculaMapper peliculaMapper;

    @Autowired
    private SalaMapper salaMapper;

    // ENTITY -> DTO
    public FuncionDTO toDto(Funcion funcion) {
        if (funcion == null) return null;
        return new FuncionDTO(
            funcion.getId(),
            funcion.getFecha(),
            funcion.getHora(),
            funcion.getPrecio(),
            funcion.getFormato(),
            peliculaMapper.toDto(funcion.getPelicula()),
            salaMapper.toDto(funcion.getSala())
        );
    }

    // DTO -> ENTITY (para crear)
    // no asigna pelicula ni sala aquí porque el servicio debe resolverlas por id
    public Funcion toEntity(FuncionCreateUpdateDTO dto) {
        if (dto == null) return null;
        Funcion f = new Funcion();
        f.setFecha(dto.getFecha());
        f.setHora(dto.getHora());
        f.setPrecio(dto.getPrecio());
        f.setFormato(dto.getFormato());
        return f;
    }

    // UPDATE (sobreescribe campos básicos)
    public void updateEntity(FuncionCreateUpdateDTO dto, Funcion funcion) {
        if (dto == null || funcion == null) return;
        funcion.setFecha(dto.getFecha());
        funcion.setHora(dto.getHora());
        funcion.setPrecio(dto.getPrecio());
        funcion.setFormato(dto.getFormato());
    }

}
