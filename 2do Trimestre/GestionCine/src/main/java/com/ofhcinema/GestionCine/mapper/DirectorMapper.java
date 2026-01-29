package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Director;
import com.ofhcinema.GestionCine.dto.create.DirectorCreateDTO;
import com.ofhcinema.GestionCine.dto.response.DirectorResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DirectorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "peliculas", ignore = true)
    Director toEntity(DirectorCreateDTO dto);

    DirectorResponseDTO toResponseDTO(Director entity);

    List<DirectorResponseDTO> toResponseDTOList(List<Director> entities);
}
