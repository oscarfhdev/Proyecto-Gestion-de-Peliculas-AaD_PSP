package com.cine.servicio;

import com.cine.dto.pelicula.PeliculaInputDTO;
import com.cine.dto.pelicula.PeliculaOutputDTO;
import com.cine.mapper.PeliculaMapper;
import com.cine.modelo.Actor;
import com.cine.modelo.Director;
import com.cine.modelo.Pelicula;
import com.cine.repositorio.ActorRepository;
import com.cine.repositorio.DirectorRepository;
import com.cine.repositorio.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final DirectorRepository directorRepository;
    private final ActorRepository actorRepository;
    private final PeliculaMapper peliculaMapper;

    public List<PeliculaOutputDTO> findAll() {
        return peliculaRepository.findAll().stream()
                .map(peliculaMapper::toDTO).collect(Collectors.toList());
    }

    public PeliculaOutputDTO findById(Long id) {
        return peliculaRepository.findById(id).map(peliculaMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Película no encontrada con ID: " + id));
    }

    public List<PeliculaOutputDTO> search(String titulo) {
        return peliculaRepository.findByTituloContainingIgnoreCase(titulo).stream()
                .map(peliculaMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public PeliculaOutputDTO save(PeliculaInputDTO dto) {
        Pelicula pelicula = peliculaMapper.toEntity(dto);
        Director director = directorRepository.findById(dto.directorId())
                .orElseThrow(() -> new RuntimeException("Director no encontrado con ID: " + dto.directorId()));
        pelicula.setDirector(director);
        if (dto.actorIds() != null && !dto.actorIds().isEmpty()) {
            Set<Actor> actores = new HashSet<>(actorRepository.findAllById(dto.actorIds()));
            pelicula.setActores(actores);
        }
        return peliculaMapper.toDTO(peliculaRepository.save(pelicula));
    }

    @Transactional
    public PeliculaOutputDTO update(Long id, PeliculaInputDTO dto) {
        Pelicula pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Película no encontrada con ID: " + id));
        peliculaMapper.update(dto, pelicula);
        if (dto.directorId() != null) {
            Director director = directorRepository.findById(dto.directorId())
                    .orElseThrow(() -> new RuntimeException("Director no encontrado con ID: " + dto.directorId()));
            pelicula.setDirector(director);
        }
        if (dto.actorIds() != null) {
            Set<Actor> actores = new HashSet<>(actorRepository.findAllById(dto.actorIds()));
            pelicula.setActores(actores);
        }
        return peliculaMapper.toDTO(peliculaRepository.save(pelicula));
    }

    public void deleteById(Long id) {
        if (!peliculaRepository.existsById(id))
            throw new RuntimeException("Película no encontrada con ID: " + id);
        peliculaRepository.deleteById(id);
    }
}
