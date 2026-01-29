package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Entrada;
import com.ofhcinema.GestionCine.dto.create.EntradaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.EntradaResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EntradaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "venta", ignore = true)
    @Mapping(target = "funcion", ignore = true)
    Entrada toEntity(EntradaCreateDTO dto);

    @Mapping(source = "venta.id", target = "ventaId")
    @Mapping(source = "funcion.pelicula.titulo", target = "peliculaTitulo")
    @Mapping(source = "funcion.fechaHora", target = "funcionFechaHora")
    EntradaResponseDTO toResponseDTO(Entrada entity);

    List<EntradaResponseDTO> toResponseDTOList(List<Entrada> entities);
}
