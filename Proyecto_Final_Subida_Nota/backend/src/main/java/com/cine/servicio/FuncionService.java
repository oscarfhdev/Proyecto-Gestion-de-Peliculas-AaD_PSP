package com.cine.servicio;

import com.cine.dto.funcion.FuncionInputDTO;
import com.cine.dto.funcion.FuncionOutputDTO;
import com.cine.mapper.FuncionMapper;
import com.cine.modelo.EstadoEntrada;
import com.cine.modelo.Funcion;
import com.cine.modelo.Pelicula;
import com.cine.modelo.Sala;
import com.cine.repositorio.FuncionRepository;
import com.cine.repositorio.PeliculaRepository;
import com.cine.repositorio.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuncionService {

    private final FuncionRepository funcionRepository;
    private final PeliculaRepository peliculaRepository;
    private final SalaRepository salaRepository;
    private final FuncionMapper funcionMapper;

    public List<FuncionOutputDTO> findAll() {
        return funcionRepository.findAll().stream().map(this::toEnrichedDTO).collect(Collectors.toList());
    }

    public FuncionOutputDTO findById(Long id) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Función no encontrada con ID: " + id));
        return toEnrichedDTO(funcion);
    }

    public List<FuncionOutputDTO> findByPeliculaId(Long peliculaId) {
        return funcionRepository.findByPeliculaId(peliculaId).stream()
                .map(this::toEnrichedDTO).collect(Collectors.toList());
    }

    @Transactional
    public FuncionOutputDTO save(FuncionInputDTO dto) {
        Funcion funcion = funcionMapper.toEntity(dto);
        Pelicula pelicula = peliculaRepository.findById(dto.peliculaId())
                .orElseThrow(() -> new RuntimeException("Película no encontrada con ID: " + dto.peliculaId()));
        Sala sala = salaRepository.findById(dto.salaId())
                .orElseThrow(() -> new RuntimeException("Sala no encontrada con ID: " + dto.salaId()));
        funcion.setPelicula(pelicula);
        funcion.setSala(sala);
        return toEnrichedDTO(funcionRepository.save(funcion));
    }

    @Transactional
    public FuncionOutputDTO update(Long id, FuncionInputDTO dto) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Función no encontrada con ID: " + id));
        funcionMapper.update(dto, funcion);
        if (dto.peliculaId() != null) {
            funcion.setPelicula(peliculaRepository.findById(dto.peliculaId())
                    .orElseThrow(() -> new RuntimeException("Película no encontrada")));
        }
        if (dto.salaId() != null) {
            funcion.setSala(salaRepository.findById(dto.salaId())
                    .orElseThrow(() -> new RuntimeException("Sala no encontrada")));
        }
        return toEnrichedDTO(funcionRepository.save(funcion));
    }

    public void deleteById(Long id) {
        if (!funcionRepository.existsById(id))
            throw new RuntimeException("Función no encontrada con ID: " + id);
        funcionRepository.deleteById(id);
    }

    public List<Map<String, Integer>> getAsientosOcupados(Long id) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Función no encontrada con ID: " + id));
        return funcion.getEntradas().stream()
                .filter(e -> e.getEstado() == EstadoEntrada.VENDIDA)
                .map(e -> Map.of("fila", e.getFila(), "asiento", e.getAsiento()))
                .collect(Collectors.toList());
    }

    /** Calcula asientos disponibles = capacidad sala - entradas vendidas */
    private FuncionOutputDTO toEnrichedDTO(Funcion funcion) {
        FuncionOutputDTO dto = funcionMapper.toDTO(funcion);
        int capacidad = funcion.getSala().getCapacidad();
        long vendidas = funcion.getEntradas().stream()
                .filter(e -> e.getEstado() == EstadoEntrada.VENDIDA).count();
        // Crear nuevo record con asientosDisponibles calculado
        return new FuncionOutputDTO(dto.id(), dto.fechaHora(), dto.precio(),
                dto.peliculaId(), dto.peliculaTitulo(), dto.salaId(), dto.salaNombre(),
                (int) (capacidad - vendidas));
    }
}
