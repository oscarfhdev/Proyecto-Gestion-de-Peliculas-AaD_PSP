package gestionPeliculas.service;

import gestionPeliculas.DTO.PlataformaCreateUpdateDTO;
import gestionPeliculas.DTO.PlataformaDTO;
import gestionPeliculas.DTO.mappers.PlataformaMapper;
import gestionPeliculas.domain.Plataforma;
import gestionPeliculas.repository.PlataformaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class PlataformaService {

    @Autowired
    private PlataformaRepository plataformaRepository;

    @Autowired
    private PlataformaMapper mapper;

    @Transactional(readOnly = true)
    public List<PlataformaDTO> listar() {
        return plataformaRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlataformaDTO buscarPorId(Long id) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Plataforma no encontrada con id: " + id));
        return mapper.toDto(plataforma);
    }

    @Transactional
    public PlataformaDTO agregar(PlataformaCreateUpdateDTO dto) {
        Plataforma plataforma = mapper.toEntity(dto);
        plataforma = plataformaRepository.save(plataforma);
        return mapper.toDto(plataforma);
    }

    @Transactional
    public PlataformaDTO actualizar(Long id, PlataformaCreateUpdateDTO dto) {
        Plataforma existente = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Plataforma no encontrada con id: " + id));

        mapper.updateEntity(dto, existente);
        Plataforma actualizado = plataformaRepository.save(existente);
        return mapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        if (!plataformaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plataforma no encontrada con id: " + id);
        }
        plataformaRepository.deleteById(id);
    }
}
