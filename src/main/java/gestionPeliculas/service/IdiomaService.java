package gestionPeliculas.service;

import gestionPeliculas.DTO.IdiomaCreateUpdateDTO;
import gestionPeliculas.DTO.IdiomaDTO;
import gestionPeliculas.DTO.mappers.IdiomaMapper;
import gestionPeliculas.domain.Idioma;
import gestionPeliculas.repository.IdiomaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class IdiomaService {

    @Autowired
    private IdiomaRepository idiomaRepository;

    @Autowired
    private IdiomaMapper mapper;

    public List<IdiomaDTO> listar() {
        return idiomaRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public IdiomaDTO buscarPorId(Long id) {
        Idioma idioma = idiomaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Idioma no encontrado con id: " + id));
        return mapper.toDto(idioma);
    }

    @Transactional
    public IdiomaDTO agregar(IdiomaCreateUpdateDTO dto) {
        Idioma idioma = mapper.toEntity(dto);
        idioma = idiomaRepository.save(idioma);
        return mapper.toDto(idioma);
    }

    @Transactional
    public IdiomaDTO actualizar(Long id, IdiomaCreateUpdateDTO dto) {
        Idioma idiomaExistente = idiomaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Idioma no encontrado con id: " + id));

        mapper.updateEntity(dto, idiomaExistente);
        Idioma actualizado = idiomaRepository.save(idiomaExistente);
        return mapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!idiomaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Idioma no encontrado con id: " + id);
        }
        idiomaRepository.deleteById(id);
    }
}
