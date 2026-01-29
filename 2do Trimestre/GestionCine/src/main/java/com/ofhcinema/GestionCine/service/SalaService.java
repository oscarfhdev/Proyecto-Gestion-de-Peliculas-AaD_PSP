package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Sala;
import com.ofhcinema.GestionCine.dto.create.SalaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.SalaResponseDTO;
import com.ofhcinema.GestionCine.mapper.SalaMapper;
import com.ofhcinema.GestionCine.repository.SalaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SalaService {

    private final SalaRepository salaRepository;
    private final SalaMapper salaMapper;

    public SalaResponseDTO create(SalaCreateDTO dto) {
        Sala sala = salaMapper.toEntity(dto);
        sala = salaRepository.save(sala);
        return salaMapper.toResponseDTO(sala);
    }

    @Transactional(readOnly = true)
    public List<SalaResponseDTO> findAll() {
        return salaMapper.toResponseDTOList(salaRepository.findAll());
    }

    @Transactional(readOnly = true)
    public SalaResponseDTO findById(Long id) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con id: " + id));
        return salaMapper.toResponseDTO(sala);
    }

    public SalaResponseDTO update(Long id, SalaCreateDTO dto) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala no encontrada con id: " + id));
        sala.setNombre(dto.getNombre());
        sala.setCapacidad(dto.getCapacidad());
        sala = salaRepository.save(sala);
        return salaMapper.toResponseDTO(sala);
    }

    public void delete(Long id) {
        if (!salaRepository.existsById(id)) {
            throw new EntityNotFoundException("Sala no encontrada con id: " + id);
        }
        salaRepository.deleteById(id);
    }
}
