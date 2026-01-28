package gestionPeliculas.service;

import gestionPeliculas.DTO.CriticaCreateUpdateDTO;
import gestionPeliculas.DTO.CriticaDTO;
import gestionPeliculas.DTO.mappers.CriticaMapper;
import gestionPeliculas.domain.Critica;
import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.domain.Usuario;
import gestionPeliculas.repository.CriticaRepository;
import gestionPeliculas.repository.PeliculaRepository;
import gestionPeliculas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CriticaService {

    @Autowired
    private CriticaRepository criticaRepository;
    @Autowired
    private PeliculaRepository peliculaRepository;

    @Autowired
    private CriticaMapper mapper;

    @Transactional(readOnly = true)
    public List<CriticaDTO> listar() {
            return criticaRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
        }

    @Transactional(readOnly = true)
    public CriticaDTO buscarPorId(Long id) {
        Critica critica = criticaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id));
        return mapper.toDto(critica);
    }

    @Transactional
    public CriticaDTO agregar(CriticaCreateUpdateDTO dto) {
        Critica critica = mapper.toEntity(dto);

        Pelicula p = peliculaRepository.findById(dto.getPeliculaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada"));
        critica.setPelicula(p);

        critica = criticaRepository.save(critica);
        return mapper.toDto(critica);
    }

    @Transactional
    public CriticaDTO actualizar(Long id, CriticaCreateUpdateDTO dto) {
        Critica criticaExistente = criticaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id));

        mapper.updateEntity(dto, criticaExistente);

        Pelicula p = peliculaRepository.findById(dto.getPeliculaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada"));
        criticaExistente.setPelicula(p);

        Critica actualizado = criticaRepository.save(criticaExistente);
        return mapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!criticaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id);
        }
        criticaRepository.deleteById(id);
    }
}
