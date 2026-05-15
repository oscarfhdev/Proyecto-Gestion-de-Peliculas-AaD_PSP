package com.cine.mapper;

import com.cine.dto.entrada.EntradaInputDTO;
import com.cine.dto.entrada.EntradaOutputDTO;
import com.cine.modelo.Entrada;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface EntradaMapper {
    @Mapping(target = "funcionId", source = "funcion.id")
    @Mapping(target = "ventaId", source = "venta.id")
    @Mapping(target = "peliculaTitulo", source = "funcion.pelicula.titulo")
    @Mapping(target = "peliculaPoster", source = "funcion.pelicula.imagenUrl")
    @Mapping(target = "salaNombre", source = "funcion.sala.nombre")
    @Mapping(target = "fechaHoraFuncion", source = "funcion.fechaHora")
    EntradaOutputDTO toDTO(Entrada entrada);

    @Mapping(target = "funcion", ignore = true)
    @Mapping(target = "venta", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "codigo", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "creadoPor", ignore = true)
    Entrada toEntity(EntradaInputDTO entradaInputDTO);
}
