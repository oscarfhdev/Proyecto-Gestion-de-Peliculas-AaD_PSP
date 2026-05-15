package com.cine.mapper;

import com.cine.dto.usuario.UsuarioInputDTO;
import com.cine.dto.usuario.UsuarioOutputDTO;
import com.cine.modelo.Rol;
import com.cine.modelo.Usuario;
import org.mapstruct.*;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UsuarioMapper {
    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRolesToStrings")
    UsuarioOutputDTO toDTO(Usuario usuario);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "ventas", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enabled", constant = "true")
    Usuario toEntity(UsuarioInputDTO usuarioInputDTO);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "ventas", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    void update(UsuarioInputDTO usuarioInputDTO, @MappingTarget Usuario usuario);

    @Named("mapRolesToStrings")
    default Set<String> mapRolesToStrings(Set<Rol> roles) {
        if (roles == null) return Collections.emptySet();
        return roles.stream().map(Rol::getNombre).collect(Collectors.toSet());
    }
}
