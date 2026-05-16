package com.cine.servicio;

import com.cine.dto.director.DirectorInputDTO;
import com.cine.dto.director.DirectorOutputDTO;
import com.cine.mapper.DirectorMapper;
import com.cine.modelo.Director;
import com.cine.repositorio.DirectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DirectorService {
    private final DirectorRepository directorRepository;
    private final DirectorMapper directorMapper;

    public List<DirectorOutputDTO> findAll() {
        return directorRepository.findAll().stream().map(directorMapper::toDTO).collect(Collectors.toList());
    }
    public DirectorOutputDTO findById(Long id) {
        return directorRepository.findById(id).map(directorMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Director no encontrado con ID: " + id));
    }
    public DirectorOutputDTO save(DirectorInputDTO dto) {
        return directorMapper.toDTO(directorRepository.save(directorMapper.toEntity(dto)));
    }
    public DirectorOutputDTO update(Long id, DirectorInputDTO dto) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Director no encontrado con ID: " + id));
        directorMapper.update(dto, director);
        return directorMapper.toDTO(directorRepository.save(director));
    }
    public void deleteById(Long id) {
        if (!directorRepository.existsById(id)) throw new RuntimeException("Director no encontrado con ID: " + id);
        directorRepository.deleteById(id);
    }
}
