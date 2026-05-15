package com.cine.mapper;

import com.cine.dto.funcion.FuncionInputDTO;
import com.cine.dto.funcion.FuncionOutputDTO;
import com.cine.modelo.Funcion;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface FuncionMapper {
    @Mapping(target = "peliculaId", source = "pelicula.id")
    @Mapping(target = "peliculaTitulo", source = "pelicula.titulo")
    @Mapping(target = "salaId", source = "sala.id")
    @Mapping(target = "salaNombre", source = "sala.nombre")
    @Mapping(target = "asientosDisponibles", ignore = true)
    FuncionOutputDTO toDTO(Funcion funcion);

    @Mapping(target = "pelicula", ignore = true)
    @Mapping(target = "sala", ignore = true)
    @Mapping(target = "entradas", ignore = true)
    @Mapping(target = "id", ignore = true)
    Funcion toEntity(FuncionInputDTO funcionInputDTO);

    @Mapping(target = "pelicula", ignore = true)
    @Mapping(target = "sala", ignore = true)
    @Mapping(target = "entradas", ignore = true)
    @Mapping(target = "id", ignore = true)
    void update(FuncionInputDTO funcionInputDTO, @MappingTarget Funcion funcion);
}
