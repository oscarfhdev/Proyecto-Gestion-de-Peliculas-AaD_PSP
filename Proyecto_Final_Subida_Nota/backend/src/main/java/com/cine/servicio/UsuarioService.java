package com.cine.servicio;

import com.cine.dto.usuario.UsuarioInputDTO;
import com.cine.dto.usuario.UsuarioOutputDTO;
import com.cine.mapper.UsuarioMapper;
import com.cine.modelo.Rol;
import com.cine.modelo.Usuario;
import com.cine.repositorio.RolRepository;
import com.cine.repositorio.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioOutputDTO> findAll() {
        return usuarioRepository.findAll().stream().map(usuarioMapper::toDTO).collect(Collectors.toList());
    }

    public UsuarioOutputDTO findById(Long id) {
        return usuarioRepository.findById(id).map(usuarioMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    /** Devuelve el perfil del usuario autenticado */
    public UsuarioOutputDTO findMiPerfil() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email).map(usuarioMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public UsuarioOutputDTO save(UsuarioInputDTO dto) {
        Usuario usuario = usuarioMapper.toEntity(dto);
        if (dto.password() != null && !dto.password().isBlank())
            usuario.setPassword(passwordEncoder.encode(dto.password()));
        if (dto.roles() != null && !dto.roles().isEmpty()) {
            Set<Rol> roles = new HashSet<>();
            for (String rolNombre : dto.roles()) {
                roles.add(rolRepository.findByNombre(rolNombre)
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + rolNombre)));
            }
            usuario.setRoles(roles);
        }
        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioOutputDTO update(Long id, UsuarioInputDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        usuarioMapper.update(dto, usuario);
        if (dto.password() != null && !dto.password().isBlank())
            usuario.setPassword(passwordEncoder.encode(dto.password()));
        if (dto.roles() != null) {
            Set<Rol> roles = new HashSet<>();
            for (String rolNombre : dto.roles()) {
                roles.add(rolRepository.findByNombre(rolNombre)
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + rolNombre)));
            }
            usuario.setRoles(roles);
        }
        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    public void deleteById(Long id) {
        if (!usuarioRepository.existsById(id))
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        usuarioRepository.deleteById(id);
    }
}
