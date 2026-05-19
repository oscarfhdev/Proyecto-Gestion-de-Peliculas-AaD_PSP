package com.cine.mapper;

import com.cine.dto.entrada.EntradaInputDTO;
import com.cine.dto.entrada.EntradaOutputDTO;
import com.cine.modelo.Entrada;
import com.cine.modelo.EstadoEntrada;
import com.cine.modelo.Funcion;
import com.cine.modelo.Pelicula;
import com.cine.modelo.Sala;
import com.cine.modelo.Venta;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-21T03:12:49+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class EntradaMapperImpl implements EntradaMapper {

    @Override
    public EntradaOutputDTO toDTO(Entrada entrada) {
        if ( entrada == null ) {
            return null;
        }

        Long funcionId = null;
        Long ventaId = null;
        String peliculaTitulo = null;
        String peliculaPoster = null;
        String salaNombre = null;
        LocalDateTime fechaHoraFuncion = null;
        Long id = null;
        String codigo = null;
        int fila = 0;
        int asiento = 0;
        EstadoEntrada estado = null;

        funcionId = entradaFuncionId( entrada );
        ventaId = entradaVentaId( entrada );
        peliculaTitulo = entradaFuncionPeliculaTitulo( entrada );
        peliculaPoster = entradaFuncionPeliculaImagenUrl( entrada );
        salaNombre = entradaFuncionSalaNombre( entrada );
        fechaHoraFuncion = entradaFuncionFechaHora( entrada );
        id = entrada.getId();
        codigo = entrada.getCodigo();
        fila = entrada.getFila();
        asiento = entrada.getAsiento();
        estado = entrada.getEstado();

        EntradaOutputDTO entradaOutputDTO = new EntradaOutputDTO( id, codigo, fila, asiento, estado, funcionId, ventaId, peliculaTitulo, peliculaPoster, salaNombre, fechaHoraFuncion );

        return entradaOutputDTO;
    }

    @Override
    public Entrada toEntity(EntradaInputDTO entradaInputDTO) {
        if ( entradaInputDTO == null ) {
            return null;
        }

        Entrada.EntradaBuilder entrada = Entrada.builder();

        entrada.fila( entradaInputDTO.fila() );
        entrada.asiento( entradaInputDTO.asiento() );

        return entrada.build();
    }

    private Long entradaFuncionId(Entrada entrada) {
        Funcion funcion = entrada.getFuncion();
        if ( funcion == null ) {
            return null;
        }
        return funcion.getId();
    }

    private Long entradaVentaId(Entrada entrada) {
        Venta venta = entrada.getVenta();
        if ( venta == null ) {
            return null;
        }
        return venta.getId();
    }

    private String entradaFuncionPeliculaTitulo(Entrada entrada) {
        Funcion funcion = entrada.getFuncion();
        if ( funcion == null ) {
            return null;
        }
        Pelicula pelicula = funcion.getPelicula();
        if ( pelicula == null ) {
            return null;
        }
        return pelicula.getTitulo();
    }

    private String entradaFuncionPeliculaImagenUrl(Entrada entrada) {
        Funcion funcion = entrada.getFuncion();
        if ( funcion == null ) {
            return null;
        }
        Pelicula pelicula = funcion.getPelicula();
        if ( pelicula == null ) {
            return null;
        }
        return pelicula.getImagenUrl();
    }

    private String entradaFuncionSalaNombre(Entrada entrada) {
        Funcion funcion = entrada.getFuncion();
        if ( funcion == null ) {
            return null;
        }
        Sala sala = funcion.getSala();
        if ( sala == null ) {
            return null;
        }
        return sala.getNombre();
    }

    private LocalDateTime entradaFuncionFechaHora(Entrada entrada) {
        Funcion funcion = entrada.getFuncion();
        if ( funcion == null ) {
            return null;
        }
        return funcion.getFechaHora();
    }
}
