package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Funcion;
import com.ofhcinema.GestionCine.dto.create.FuncionCreateDTO;
import com.ofhcinema.GestionCine.dto.response.FuncionResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FuncionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sala", ignore = true)
    @Mapping(target = "pelicula", ignore = true)
    @Mapping(target = "entradas", ignore = true)
    Funcion toEntity(FuncionCreateDTO dto);

    @Mapping(source = "sala.nombre", target = "salaNombre")
    @Mapping(source = "pelicula.titulo", target = "peliculaTitulo")
    FuncionResponseDTO toResponseDTO(Funcion entity);

    List<FuncionResponseDTO> toResponseDTOList(List<Funcion> entities);
}
