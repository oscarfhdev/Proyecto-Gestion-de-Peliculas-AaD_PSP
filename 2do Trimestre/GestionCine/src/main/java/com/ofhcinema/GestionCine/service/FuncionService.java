package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Funcion;
import com.ofhcinema.GestionCine.domain.Pelicula;
import com.ofhcinema.GestionCine.domain.Sala;
import com.ofhcinema.GestionCine.dto.create.FuncionCreateDTO;
import com.ofhcinema.GestionCine.dto.response.FuncionResponseDTO;
import com.ofhcinema.GestionCine.mapper.FuncionMapper;
import com.ofhcinema.GestionCine.repository.FuncionRepository;
import com.ofhcinema.GestionCine.repository.PeliculaRepository;
import com.ofhcinema.GestionCine.repository.SalaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FuncionService {

    private final FuncionRepository funcionRepository;
    private final SalaRepository salaRepository;
    private final PeliculaRepository peliculaRepository;
    private final FuncionMapper funcionMapper;

    public FuncionResponseDTO create(FuncionCreateDTO dto) {
        Sala sala = salaRepository.findById(dto.getSalaId())
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con id: " + dto.getSalaId()));

        Pelicula pelicula = peliculaRepository.findById(dto.getPeliculaId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Película no encontrada con id: " + dto.getPeliculaId()));

        Funcion funcion = funcionMapper.toEntity(dto);
        funcion.setSala(sala);
        funcion.setPelicula(pelicula);

        funcion = funcionRepository.save(funcion);
        return funcionMapper.toResponseDTO(funcion);
    }

    @Transactional(readOnly = true)
    public List<FuncionResponseDTO> findAll() {
        return funcionMapper.toResponseDTOList(funcionRepository.findAll());
    }

    @Transactional(readOnly = true)
    public FuncionResponseDTO findById(Long id) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Función no encontrada con id: " + id));
        return funcionMapper.toResponseDTO(funcion);
    }

    @Transactional(readOnly = true)
    public List<FuncionResponseDTO> findBySalaId(Long salaId) {
        return funcionMapper.toResponseDTOList(funcionRepository.findBySalaId(salaId));
    }

    @Transactional(readOnly = true)
    public List<FuncionResponseDTO> findByPeliculaId(Long peliculaId) {
        return funcionMapper.toResponseDTOList(funcionRepository.findByPeliculaId(peliculaId));
    }

    @Transactional(readOnly = true)
    public List<FuncionResponseDTO> findByDateRange(LocalDateTime inicio, LocalDateTime fin) {
        return funcionMapper.toResponseDTOList(funcionRepository.findByFechaHoraBetween(inicio, fin));
    }

    public FuncionResponseDTO update(Long id, FuncionCreateDTO dto) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Función no encontrada con id: " + id));

        Sala sala = salaRepository.findById(dto.getSalaId())
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con id: " + dto.getSalaId()));

        Pelicula pelicula = peliculaRepository.findById(dto.getPeliculaId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Película no encontrada con id: " + dto.getPeliculaId()));

        funcion.setFechaHora(dto.getFechaHora());
        funcion.setPrecio(dto.getPrecio());
        funcion.setSala(sala);
        funcion.setPelicula(pelicula);

        funcion = funcionRepository.save(funcion);
        return funcionMapper.toResponseDTO(funcion);
    }

    public void delete(Long id) {
        if (!funcionRepository.existsById(id)) {
            throw new EntityNotFoundException("Función no encontrada con id: " + id);
        }
        funcionRepository.deleteById(id);
    }
}
