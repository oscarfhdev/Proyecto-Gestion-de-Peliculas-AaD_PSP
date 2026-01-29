package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Sala;
import com.ofhcinema.GestionCine.dto.create.SalaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.SalaResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SalaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "funciones", ignore = true)
    Sala toEntity(SalaCreateDTO dto);

    SalaResponseDTO toResponseDTO(Sala entity);

    List<SalaResponseDTO> toResponseDTOList(List<Sala> entities);
}
