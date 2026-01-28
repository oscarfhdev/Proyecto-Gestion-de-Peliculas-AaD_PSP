package gestionPeliculas.service;

import gestionPeliculas.DTO.SalaCreateUpdateDTO;
import gestionPeliculas.DTO.SalaDTO;
import gestionPeliculas.DTO.mappers.SalaMapper;
import gestionPeliculas.domain.Sala;
import gestionPeliculas.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SalaService {

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private SalaMapper mapper;

    public List<SalaDTO> listar() {
        return salaRepository.findAll()
            .stream()
            .map(mapper::toDto)
            .toList();
    }

    public SalaDTO buscarPorId(Long id) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada con id: " + id));
        return mapper.toDto(sala);
    }

    @Transactional
    public SalaDTO agregar(SalaCreateUpdateDTO dto) {
        Sala sala = mapper.toEntity(dto);
        sala = salaRepository.save(sala);
        return mapper.toDto(sala);
    }

    @Transactional
    public SalaDTO actualizar(Long id, SalaCreateUpdateDTO dto) {
        Sala existente = salaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada con id: " + id));

        mapper.updateEntity(dto, existente);
        existente = salaRepository.save(existente);

        return mapper.toDto(existente);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!salaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada con id: " + id);
        }
        salaRepository.deleteById(id);
    }
}
