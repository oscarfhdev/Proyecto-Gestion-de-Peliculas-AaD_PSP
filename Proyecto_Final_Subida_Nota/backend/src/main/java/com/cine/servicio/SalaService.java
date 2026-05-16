package com.cine.servicio;

import com.cine.dto.sala.SalaInputDTO;
import com.cine.dto.sala.SalaOutputDTO;
import com.cine.mapper.SalaMapper;
import com.cine.modelo.Sala;
import com.cine.repositorio.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaService {

    private final SalaRepository salaRepository;
    private final SalaMapper salaMapper;

    public List<SalaOutputDTO> findAll() {
        return salaRepository.findAll().stream().map(salaMapper::toDTO).collect(Collectors.toList());
    }

    public SalaOutputDTO findById(Long id) {
        return salaRepository.findById(id).map(salaMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada con ID: " + id));
    }

    public SalaOutputDTO save(SalaInputDTO dto) {
        Sala sala = salaMapper.toEntity(dto);
        return salaMapper.toDTO(salaRepository.save(sala));
    }

    public SalaOutputDTO update(Long id, SalaInputDTO dto) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada con ID: " + id));
        salaMapper.update(dto, sala);
        return salaMapper.toDTO(salaRepository.save(sala));
    }

    public void deleteById(Long id) {
        if (!salaRepository.existsById(id))
            throw new RuntimeException("Sala no encontrada con ID: " + id);
        salaRepository.deleteById(id);
    }
}
