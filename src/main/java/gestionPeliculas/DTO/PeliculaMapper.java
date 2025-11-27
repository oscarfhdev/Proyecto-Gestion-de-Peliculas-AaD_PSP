package gestionPeliculas.DTO;

import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.DTO.PeliculaCreateUpdateDTO;
import gestionPeliculas.DTO.PeliculaDTO;
import org.springframework.stereotype.Component;

@Component
public class PeliculaMapper {

    public PeliculaDTO toDto(Pelicula pelicula) {
        if (pelicula == null) return null;
        return new PeliculaDTO(
                pelicula.getId(),
                pelicula.getTitulo(),
                pelicula.getDuracion(),
                pelicula.getFechaEstreno(),
                pelicula.getSinopsis(),
                pelicula.getValoracion()
        );
    }

    // DTO -> ENTITY (para crear)
    public Pelicula toEntity(PeliculaCreateUpdateDTO peliculaCreateUpdateDTO) {
        if (peliculaCreateUpdateDTO == null) return null;
        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(peliculaCreateUpdateDTO.getTitulo());
        pelicula.setDuracion(peliculaCreateUpdateDTO.getDuracion());
        pelicula.setFechaEstreno(peliculaCreateUpdateDTO.getFechaEstreno());
        pelicula.setSinopsis(peliculaCreateUpdateDTO.getSinopsis());
        pelicula.setValoracion(peliculaCreateUpdateDTO.getValoracion());
        return pelicula;
    }

    // UPDATE, se sobreescribe todo
    public void updateEntity(PeliculaCreateUpdateDTO peliculaCreateUpdateDTO, Pelicula pelicula) {
        if (peliculaCreateUpdateDTO == null || pelicula == null) return;

        pelicula.setTitulo(peliculaCreateUpdateDTO.getTitulo());
        pelicula.setDuracion(peliculaCreateUpdateDTO.getDuracion());
        pelicula.setFechaEstreno(peliculaCreateUpdateDTO.getFechaEstreno());
        pelicula.setSinopsis(peliculaCreateUpdateDTO.getSinopsis());
        pelicula.setValoracion(peliculaCreateUpdateDTO.getValoracion());
    }
}
