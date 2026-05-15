package com.cine.mapper;

import com.cine.dto.director.DirectorInputDTO;
import com.cine.dto.director.DirectorOutputDTO;
import com.cine.modelo.Director;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface DirectorMapper {
    DirectorOutputDTO toDTO(Director director);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "peliculas", ignore = true)
    Director toEntity(DirectorInputDTO directorInputDTO);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "peliculas", ignore = true)
    void update(DirectorInputDTO directorInputDTO, @MappingTarget Director director);
}
