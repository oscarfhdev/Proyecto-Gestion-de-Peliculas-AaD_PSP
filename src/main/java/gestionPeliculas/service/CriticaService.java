package gestionPeliculas.service;

import gestionPeliculas.DTO.CriticaCreateUpdateDTO;
import gestionPeliculas.DTO.mappers.CriticaMapper;
import gestionPeliculas.domain.Critica;
import gestionPeliculas.repository.CriticaRepository;
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
    private CriticaMapper mapper;

    public List<CriticaCreateUpdateDTO> listar() {
            return criticaRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
        }

    public CriticaCreateUpdateDTO buscarPorId(Long id) {
        Critica critica = criticaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id));
        return mapper.toDto(critica);
    }

    @Transactional
    public CriticaCreateUpdateDTO agregar(CriticaCreateUpdateDTO dto) {
        Critica critica = mapper.toEntity(dto);
        critica = criticaRepository.save(critica);
        return mapper.toDto(critica);
    }

    @Transactional
    public CriticaCreateUpdateDTO actualizar(Long id, CriticaCreateUpdateDTO dto) {
        Critica criticaExistente = criticaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica no encontrada con id: " + id));

        mapper.updateEntity(dto, criticaExistente);
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
