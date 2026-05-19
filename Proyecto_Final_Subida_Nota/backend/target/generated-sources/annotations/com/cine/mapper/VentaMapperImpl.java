package com.cine.mapper;

import com.cine.dto.entrada.EntradaOutputDTO;
import com.cine.dto.venta.VentaInputDTO;
import com.cine.dto.venta.VentaOutputDTO;
import com.cine.modelo.Entrada;
import com.cine.modelo.Usuario;
import com.cine.modelo.Venta;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-21T03:12:49+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class VentaMapperImpl implements VentaMapper {

    @Autowired
    private EntradaMapper entradaMapper;

    @Override
    public VentaOutputDTO toDTO(Venta venta) {
        if ( venta == null ) {
            return null;
        }

        Long usuarioId = null;
        Long id = null;
        LocalDateTime fecha = null;
        double importeTotal = 0.0d;
        String metodoPago = null;
        String estado = null;
        String creadoPor = null;
        Set<EntradaOutputDTO> entradas = null;

        usuarioId = ventaUsuarioId( venta );
        id = venta.getId();
        fecha = venta.getFecha();
        importeTotal = venta.getImporteTotal();
        metodoPago = venta.getMetodoPago();
        estado = venta.getEstado();
        creadoPor = venta.getCreadoPor();
        entradas = entradaSetToEntradaOutputDTOSet( venta.getEntradas() );

        VentaOutputDTO ventaOutputDTO = new VentaOutputDTO( id, fecha, importeTotal, metodoPago, estado, creadoPor, entradas, usuarioId );

        return ventaOutputDTO;
    }

    @Override
    public Venta toEntity(VentaInputDTO ventaInputDTO) {
        if ( ventaInputDTO == null ) {
            return null;
        }

        Venta.VentaBuilder venta = Venta.builder();

        venta.metodoPago( ventaInputDTO.metodoPago() );

        return venta.build();
    }

    private Long ventaUsuarioId(Venta venta) {
        Usuario usuario = venta.getUsuario();
        if ( usuario == null ) {
            return null;
        }
        return usuario.getId();
    }

    protected Set<EntradaOutputDTO> entradaSetToEntradaOutputDTOSet(Set<Entrada> set) {
        if ( set == null ) {
            return null;
        }

        Set<EntradaOutputDTO> set1 = LinkedHashSet.newLinkedHashSet( set.size() );
        for ( Entrada entrada : set ) {
            set1.add( entradaMapper.toDTO( entrada ) );
        }

        return set1;
    }
}
