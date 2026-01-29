package com.ofhcinema.GestionCine.mapper;

import com.ofhcinema.GestionCine.domain.Usuario;
import com.ofhcinema.GestionCine.dto.create.UsuarioCreateDTO;
import com.ofhcinema.GestionCine.dto.response.UsuarioResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rol", ignore = true)
    @Mapping(target = "ventas", ignore = true)
    Usuario toEntity(UsuarioCreateDTO dto);

    @Mapping(source = "rol.nombre", target = "rolNombre")
    UsuarioResponseDTO toResponseDTO(Usuario entity);

    List<UsuarioResponseDTO> toResponseDTOList(List<Usuario> entities);
}
