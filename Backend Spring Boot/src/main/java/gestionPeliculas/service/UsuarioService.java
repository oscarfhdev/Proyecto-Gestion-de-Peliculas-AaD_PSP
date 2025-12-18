package gestionPeliculas.service;

import gestionPeliculas.DTO.UsuarioCreateUpdateDTO;
import gestionPeliculas.DTO.UsuarioDTO;
import gestionPeliculas.DTO.mappers.UsuarioMapper;
import gestionPeliculas.domain.Usuario;
import gestionPeliculas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper mapper;

    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + id));
        return mapper.toDto(usuario);
    }

    @Transactional
    public UsuarioDTO agregar(UsuarioCreateUpdateDTO dto) {
        Usuario usuario = mapper.toEntity(dto);
        usuario = usuarioRepository.save(usuario);
        return mapper.toDto(usuario);
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioCreateUpdateDTO dto) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + id));

        mapper.updateEntity(dto, usuarioExistente);
        Usuario actualizado = usuarioRepository.save(usuarioExistente);
        return mapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public UsuarioDTO login(String username, String password) {
        Usuario usuario = usuarioRepository.findByUsername(username);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado");
        }
        if (!usuario.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
        return mapper.toDto(usuario);
    }
}
