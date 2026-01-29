package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Director;
import com.ofhcinema.GestionCine.dto.create.DirectorCreateDTO;
import com.ofhcinema.GestionCine.dto.response.DirectorResponseDTO;
import com.ofhcinema.GestionCine.mapper.DirectorMapper;
import com.ofhcinema.GestionCine.repository.DirectorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DirectorService {

    private final DirectorRepository directorRepository;
    private final DirectorMapper directorMapper;

    public DirectorResponseDTO create(DirectorCreateDTO dto) {
        Director director = directorMapper.toEntity(dto);
        director = directorRepository.save(director);
        return directorMapper.toResponseDTO(director);
    }

    @Transactional(readOnly = true)
    public List<DirectorResponseDTO> findAll() {
        return directorMapper.toResponseDTOList(directorRepository.findAll());
    }

    @Transactional(readOnly = true)
    public DirectorResponseDTO findById(Long id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Director no encontrado con id: " + id));
        return directorMapper.toResponseDTO(director);
    }

    public DirectorResponseDTO update(Long id, DirectorCreateDTO dto) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Director no encontrado con id: " + id));
        director.setNombre(dto.getNombre());
        director = directorRepository.save(director);
        return directorMapper.toResponseDTO(director);
    }

    public void delete(Long id) {
        if (!directorRepository.existsById(id)) {
            throw new EntityNotFoundException("Director no encontrado con id: " + id);
        }
        directorRepository.deleteById(id);
    }
}
