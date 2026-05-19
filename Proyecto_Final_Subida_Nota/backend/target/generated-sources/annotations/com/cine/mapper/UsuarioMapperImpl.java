package com.cine.mapper;

import com.cine.dto.usuario.UsuarioInputDTO;
import com.cine.dto.usuario.UsuarioOutputDTO;
import com.cine.modelo.Usuario;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-21T03:12:49+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    @Override
    public UsuarioOutputDTO toDTO(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        Set<String> roles = null;
        Long id = null;
        String email = null;
        String nombre = null;
        boolean enabled = false;

        roles = mapRolesToStrings( usuario.getRoles() );
        id = usuario.getId();
        email = usuario.getEmail();
        nombre = usuario.getNombre();
        enabled = usuario.isEnabled();

        UsuarioOutputDTO usuarioOutputDTO = new UsuarioOutputDTO( id, email, nombre, enabled, roles );

        return usuarioOutputDTO;
    }

    @Override
    public Usuario toEntity(UsuarioInputDTO usuarioInputDTO) {
        if ( usuarioInputDTO == null ) {
            return null;
        }

        Usuario.UsuarioBuilder usuario = Usuario.builder();

        usuario.email( usuarioInputDTO.email() );
        usuario.password( usuarioInputDTO.password() );
        usuario.nombre( usuarioInputDTO.nombre() );

        usuario.enabled( true );

        return usuario.build();
    }

    @Override
    public void update(UsuarioInputDTO usuarioInputDTO, Usuario usuario) {
        if ( usuarioInputDTO == null ) {
            return;
        }

        usuario.setEmail( usuarioInputDTO.email() );
        usuario.setNombre( usuarioInputDTO.nombre() );
    }
}
