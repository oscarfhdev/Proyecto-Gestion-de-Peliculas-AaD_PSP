package com.cine.mapper;

import com.cine.dto.funcion.FuncionInputDTO;
import com.cine.dto.funcion.FuncionOutputDTO;
import com.cine.modelo.Funcion;
import com.cine.modelo.Pelicula;
import com.cine.modelo.Sala;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-21T03:12:49+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class FuncionMapperImpl implements FuncionMapper {

    @Override
    public FuncionOutputDTO toDTO(Funcion funcion) {
        if ( funcion == null ) {
            return null;
        }

        Long peliculaId = null;
        String peliculaTitulo = null;
        Long salaId = null;
        String salaNombre = null;
        Long id = null;
        LocalDateTime fechaHora = null;
        double precio = 0.0d;

        peliculaId = funcionPeliculaId( funcion );
        peliculaTitulo = funcionPeliculaTitulo( funcion );
        salaId = funcionSalaId( funcion );
        salaNombre = funcionSalaNombre( funcion );
        id = funcion.getId();
        fechaHora = funcion.getFechaHora();
        precio = funcion.getPrecio();

        int asientosDisponibles = 0;
        int salaCapacidad = 0;
        int salaFilas = 0;
        int salaAsientosPorFila = 0;

        FuncionOutputDTO funcionOutputDTO = new FuncionOutputDTO( id, fechaHora, precio, peliculaId, peliculaTitulo, salaId, salaNombre, asientosDisponibles, salaCapacidad, salaFilas, salaAsientosPorFila );

        return funcionOutputDTO;
    }

    @Override
    public Funcion toEntity(FuncionInputDTO funcionInputDTO) {
        if ( funcionInputDTO == null ) {
            return null;
        }

        Funcion.FuncionBuilder funcion = Funcion.builder();

        funcion.fechaHora( funcionInputDTO.fechaHora() );
        funcion.precio( funcionInputDTO.precio() );

        return funcion.build();
    }

    @Override
    public void update(FuncionInputDTO funcionInputDTO, Funcion funcion) {
        if ( funcionInputDTO == null ) {
            return;
        }

        funcion.setFechaHora( funcionInputDTO.fechaHora() );
        funcion.setPrecio( funcionInputDTO.precio() );
    }

    private Long funcionPeliculaId(Funcion funcion) {
        Pelicula pelicula = funcion.getPelicula();
        if ( pelicula == null ) {
            return null;
        }
        return pelicula.getId();
    }

    private String funcionPeliculaTitulo(Funcion funcion) {
        Pelicula pelicula = funcion.getPelicula();
        if ( pelicula == null ) {
            return null;
        }
        return pelicula.getTitulo();
    }

    private Long funcionSalaId(Funcion funcion) {
        Sala sala = funcion.getSala();
        if ( sala == null ) {
            return null;
        }
        return sala.getId();
    }

    private String funcionSalaNombre(Funcion funcion) {
        Sala sala = funcion.getSala();
        if ( sala == null ) {
            return null;
        }
        return sala.getNombre();
    }
}
