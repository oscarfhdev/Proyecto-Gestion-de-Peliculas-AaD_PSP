package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Rol;
import com.ofhcinema.GestionCine.domain.Usuario;
import com.ofhcinema.GestionCine.dto.create.UsuarioCreateDTO;
import com.ofhcinema.GestionCine.dto.response.UsuarioResponseDTO;
import com.ofhcinema.GestionCine.mapper.UsuarioMapper;
import com.ofhcinema.GestionCine.repository.RolRepository;
import com.ofhcinema.GestionCine.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioResponseDTO create(UsuarioCreateDTO dto) {
        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado con id: " + dto.getRolId()));

        Usuario usuario = usuarioMapper.toEntity(dto);
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> findAll() {
        return usuarioMapper.toResponseDTOList(usuarioRepository.findAll());
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO findById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
        return usuarioMapper.toResponseDTO(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO findByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con email: " + email));
        return usuarioMapper.toResponseDTO(usuario);
    }

    public UsuarioResponseDTO update(Long id, UsuarioCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));

        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado con id: " + dto.getRolId()));

        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
        usuario.setEnabled(dto.getEnabled());
        usuario.setRol(rol);

        usuario = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(usuario);
    }

    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}
