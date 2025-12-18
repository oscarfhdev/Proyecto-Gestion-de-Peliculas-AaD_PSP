package gestionPeliculas.service;

import gestionPeliculas.DTO.FuncionCreateUpdateDTO;
import gestionPeliculas.DTO.FuncionDTO;
import gestionPeliculas.DTO.mappers.FuncionMapper;
import gestionPeliculas.domain.Funcion;
import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.domain.Sala;
import gestionPeliculas.repository.FuncionRepository;
import gestionPeliculas.repository.PeliculaRepository;
import gestionPeliculas.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuncionService {

    private final FuncionRepository funcionRepository;
    private final FuncionMapper mapper;
    private final PeliculaRepository peliculaRepository;
    private final SalaRepository salaRepository;

    @Transactional(readOnly = true)
    public List<FuncionDTO> listar() {
        return funcionRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public FuncionDTO buscarPorId(Long id) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada"));
        return mapper.toDto(funcion);
    }

    @Transactional
    public FuncionDTO agregar(FuncionCreateUpdateDTO dto) {
        Funcion funcion = mapper.toEntity(dto); // Convierte fecha/hora

        // ASIGNAR RELACIONES
        Pelicula p = peliculaRepository.findById(dto.getPeliculaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada"));
        funcion.setPelicula(p);

        Sala s = salaRepository.findById(dto.getSalaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada"));
        funcion.setSala(s);

        funcion = funcionRepository.save(funcion);
        return mapper.toDto(funcion);
    }

    @Transactional
    public FuncionDTO actualizar(Long id, FuncionCreateUpdateDTO dto) {
        Funcion existente = funcionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada"));

        mapper.updateEntity(dto, existente);

        Pelicula p = peliculaRepository.findById(dto.getPeliculaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Película no encontrada"));
        existente.setPelicula(p);

        // Buscamos la nueva sala (por si la han movido de sala)
        Sala s = salaRepository.findById(dto.getSalaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sala no encontrada"));
        existente.setSala(s);

        existente = funcionRepository.save(existente);

        return mapper.toDto(existente);
    }

    public void eliminar(Long id) {
        if (!funcionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada");
        }
        funcionRepository.deleteById(id);
    }
}
