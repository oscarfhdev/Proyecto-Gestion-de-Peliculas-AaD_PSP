package com.cine.mapper;

import com.cine.dto.sala.SalaInputDTO;
import com.cine.dto.sala.SalaOutputDTO;
import com.cine.modelo.Sala;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SalaMapper {
    SalaOutputDTO toDTO(Sala sala);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "funciones", ignore = true)
    @Mapping(target = "butacas", ignore = true)
    Sala toEntity(SalaInputDTO salaInputDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "funciones", ignore = true)
    @Mapping(target = "butacas", ignore = true)
    void update(SalaInputDTO salaInputDTO, @MappingTarget Sala sala);
}
