package gestionPeliculas.DTO.mappers;

import gestionPeliculas.DTO.UsuarioCreateUpdateDTO;
import gestionPeliculas.DTO.UsuarioDTO;
import gestionPeliculas.domain.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioDTO toDto(Usuario usuario) {
        if (usuario == null) return null;
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail()
        );
    }

    public Usuario toEntity(UsuarioCreateUpdateDTO dto) {
        if (dto == null) return null;
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
        return usuario;
    }

    public void updateEntity(UsuarioCreateUpdateDTO dto, Usuario usuario) {
        if (dto == null || usuario == null) return;
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
    }
}
