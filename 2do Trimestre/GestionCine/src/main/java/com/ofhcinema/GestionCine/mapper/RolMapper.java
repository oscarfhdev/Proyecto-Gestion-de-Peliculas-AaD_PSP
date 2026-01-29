package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Rol;
import com.ofhcinema.GestionCine.dto.create.RolCreateDTO;
import com.ofhcinema.GestionCine.dto.response.RolResponseDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RolMapper {

    Rol toEntity(RolCreateDTO dto);

    RolResponseDTO toResponseDTO(Rol entity);

    List<RolResponseDTO> toResponseDTOList(List<Rol> entities);
}
