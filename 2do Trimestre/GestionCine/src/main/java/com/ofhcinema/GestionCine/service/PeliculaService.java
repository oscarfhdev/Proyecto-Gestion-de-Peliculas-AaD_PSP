package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Actor;
import com.ofhcinema.GestionCine.domain.Director;
import com.ofhcinema.GestionCine.domain.Pelicula;
import com.ofhcinema.GestionCine.dto.create.PeliculaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.PeliculaResponseDTO;
import com.ofhcinema.GestionCine.mapper.PeliculaMapper;
import com.ofhcinema.GestionCine.repository.ActorRepository;
import com.ofhcinema.GestionCine.repository.DirectorRepository;
import com.ofhcinema.GestionCine.repository.PeliculaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final DirectorRepository directorRepository;
    private final ActorRepository actorRepository;
    private final PeliculaMapper peliculaMapper;

    public PeliculaResponseDTO create(PeliculaCreateDTO dto) {
        Pelicula pelicula = peliculaMapper.toEntity(dto);

        if (dto.getDirectorId() != null) {
            Director director = directorRepository.findById(dto.getDirectorId())
                    .orElseThrow(
                            () -> new EntityNotFoundException("Director no encontrado con id: " + dto.getDirectorId()));
            pelicula.setDirector(director);
        }

        if (dto.getActorIds() != null && !dto.getActorIds().isEmpty()) {
            Set<Actor> actores = new HashSet<>();
            for (Long actorId : dto.getActorIds()) {
                Actor actor = actorRepository.findById(actorId)
                        .orElseThrow(() -> new EntityNotFoundException("Actor no encontrado con id: " + actorId));
                actores.add(actor);
            }
            pelicula.setActores(actores);
        }

        pelicula = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(pelicula);
    }

    @Transactional(readOnly = true)
    public List<PeliculaResponseDTO> findAll() {
        return peliculaMapper.toResponseDTOList(peliculaRepository.findAll());
    }

    @Transactional(readOnly = true)
    public PeliculaResponseDTO findById(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Película no encontrada con id: " + id));
        return peliculaMapper.toResponseDTO(pelicula);
    }

    @Transactional(readOnly = true)
    public List<PeliculaResponseDTO> findByDirectorId(Long directorId) {
        return peliculaMapper.toResponseDTOList(peliculaRepository.findByDirectorId(directorId));
    }

    public PeliculaResponseDTO update(Long id, PeliculaCreateDTO dto) {
        Pelicula pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Película no encontrada con id: " + id));

        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setEdadMinima(dto.getEdadMinima());

        if (dto.getDirectorId() != null) {
            Director director = directorRepository.findById(dto.getDirectorId())
                    .orElseThrow(
                            () -> new EntityNotFoundException("Director no encontrado con id: " + dto.getDirectorId()));
            pelicula.setDirector(director);
        }

        if (dto.getActorIds() != null) {
            Set<Actor> actores = new HashSet<>();
            for (Long actorId : dto.getActorIds()) {
                Actor actor = actorRepository.findById(actorId)
                        .orElseThrow(() -> new EntityNotFoundException("Actor no encontrado con id: " + actorId));
                actores.add(actor);
            }
            pelicula.setActores(actores);
        }

        pelicula = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponseDTO(pelicula);
    }

    public void delete(Long id) {
        if (!peliculaRepository.existsById(id)) {
            throw new EntityNotFoundException("Película no encontrada con id: " + id);
        }
        peliculaRepository.deleteById(id);
    }
}
