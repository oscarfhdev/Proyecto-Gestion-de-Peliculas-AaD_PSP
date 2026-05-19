package com.cine.mapper;

import com.cine.dto.director.DirectorInputDTO;
import com.cine.dto.director.DirectorOutputDTO;
import com.cine.modelo.Director;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-21T03:12:49+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class DirectorMapperImpl implements DirectorMapper {

    @Override
    public DirectorOutputDTO toDTO(Director director) {
        if ( director == null ) {
            return null;
        }

        Long id = null;
        String nombre = null;

        id = director.getId();
        nombre = director.getNombre();

        DirectorOutputDTO directorOutputDTO = new DirectorOutputDTO( id, nombre );

        return directorOutputDTO;
    }

    @Override
    public Director toEntity(DirectorInputDTO directorInputDTO) {
        if ( directorInputDTO == null ) {
            return null;
        }

        Director.DirectorBuilder director = Director.builder();

        director.nombre( directorInputDTO.nombre() );

        return director.build();
    }

    @Override
    public void update(DirectorInputDTO directorInputDTO, Director director) {
        if ( directorInputDTO == null ) {
            return;
        }

        director.setNombre( directorInputDTO.nombre() );
    }
}
