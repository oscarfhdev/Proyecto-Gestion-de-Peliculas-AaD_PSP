package com.cine.mapper;

import com.cine.dto.pelicula.PeliculaInputDTO;
import com.cine.dto.pelicula.PeliculaOutputDTO;
import com.cine.modelo.Director;
import com.cine.modelo.Pelicula;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-19T23:03:40+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class PeliculaMapperImpl extends PeliculaMapper {

    @Override
    public PeliculaOutputDTO toDTO(Pelicula pelicula) {
        if ( pelicula == null ) {
            return null;
        }

        Long directorId = null;
        String directorNombre = null;
        Set<Long> actorIds = null;
        Long id = null;
        String titulo = null;
        String sinopsis = null;
        String genero = null;
        String imagenUrl = null;
        int duracion = 0;
        int edadMinima = 0;

        directorId = peliculaDirectorId( pelicula );
        directorNombre = peliculaDirectorNombre( pelicula );
        actorIds = mapActorsToIds( pelicula.getActores() );
        id = pelicula.getId();
        titulo = pelicula.getTitulo();
        sinopsis = pelicula.getSinopsis();
        genero = pelicula.getGenero();
        imagenUrl = pelicula.getImagenUrl();
        duracion = pelicula.getDuracion();
        edadMinima = pelicula.getEdadMinima();

        PeliculaOutputDTO peliculaOutputDTO = new PeliculaOutputDTO( id, titulo, sinopsis, genero, imagenUrl, duracion, edadMinima, directorId, directorNombre, actorIds );

        return peliculaOutputDTO;
    }

    @Override
    public Pelicula toEntity(PeliculaInputDTO peliculaInputDTO) {
        if ( peliculaInputDTO == null ) {
            return null;
        }

        Pelicula.PeliculaBuilder pelicula = Pelicula.builder();

        pelicula.titulo( peliculaInputDTO.titulo() );
        pelicula.sinopsis( peliculaInputDTO.sinopsis() );
        pelicula.genero( peliculaInputDTO.genero() );
        pelicula.imagenUrl( peliculaInputDTO.imagenUrl() );
        pelicula.duracion( peliculaInputDTO.duracion() );
        pelicula.edadMinima( peliculaInputDTO.edadMinima() );

        return pelicula.build();
    }

    @Override
    public void update(PeliculaInputDTO peliculaInputDTO, Pelicula pelicula) {
        if ( peliculaInputDTO == null ) {
            return;
        }

        pelicula.setTitulo( peliculaInputDTO.titulo() );
        pelicula.setSinopsis( peliculaInputDTO.sinopsis() );
        pelicula.setGenero( peliculaInputDTO.genero() );
        pelicula.setImagenUrl( peliculaInputDTO.imagenUrl() );
        pelicula.setDuracion( peliculaInputDTO.duracion() );
        pelicula.setEdadMinima( peliculaInputDTO.edadMinima() );
    }

    private Long peliculaDirectorId(Pelicula pelicula) {
        Director director = pelicula.getDirector();
        if ( director == null ) {
            return null;
        }
        return director.getId();
    }

    private String peliculaDirectorNombre(Pelicula pelicula) {
        Director director = pelicula.getDirector();
        if ( director == null ) {
            return null;
        }
        return director.getNombre();
    }
}
