package com.cine.mapper;

import com.cine.dto.sala.SalaInputDTO;
import com.cine.dto.sala.SalaOutputDTO;
import com.cine.modelo.Sala;
import com.cine.modelo.TipoSala;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-21T03:12:49+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class SalaMapperImpl implements SalaMapper {

    @Override
    public SalaOutputDTO toDTO(Sala sala) {
        if ( sala == null ) {
            return null;
        }

        Long id = null;
        String nombre = null;
        int capacidad = 0;
        String tipo = null;
        int filas = 0;
        int asientosPorFila = 0;

        id = sala.getId();
        nombre = sala.getNombre();
        capacidad = sala.getCapacidad();
        if ( sala.getTipo() != null ) {
            tipo = sala.getTipo().name();
        }
        filas = sala.getFilas();
        asientosPorFila = sala.getAsientosPorFila();

        SalaOutputDTO salaOutputDTO = new SalaOutputDTO( id, nombre, capacidad, tipo, filas, asientosPorFila );

        return salaOutputDTO;
    }

    @Override
    public Sala toEntity(SalaInputDTO salaInputDTO) {
        if ( salaInputDTO == null ) {
            return null;
        }

        Sala.SalaBuilder sala = Sala.builder();

        sala.nombre( salaInputDTO.nombre() );
        sala.capacidad( salaInputDTO.capacidad() );
        if ( salaInputDTO.tipo() != null ) {
            sala.tipo( Enum.valueOf( TipoSala.class, salaInputDTO.tipo() ) );
        }
        sala.filas( salaInputDTO.filas() );
        sala.asientosPorFila( salaInputDTO.asientosPorFila() );

        return sala.build();
    }

    @Override
    public void update(SalaInputDTO salaInputDTO, Sala sala) {
        if ( salaInputDTO == null ) {
            return;
        }

        sala.setNombre( salaInputDTO.nombre() );
        sala.setCapacidad( salaInputDTO.capacidad() );
        if ( salaInputDTO.tipo() != null ) {
            sala.setTipo( Enum.valueOf( TipoSala.class, salaInputDTO.tipo() ) );
        }
        else {
            sala.setTipo( null );
        }
        sala.setFilas( salaInputDTO.filas() );
        sala.setAsientosPorFila( salaInputDTO.asientosPorFila() );
    }
}
