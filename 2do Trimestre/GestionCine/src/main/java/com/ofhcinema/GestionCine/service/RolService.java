package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Rol;
import com.ofhcinema.GestionCine.dto.create.RolCreateDTO;
import com.ofhcinema.GestionCine.dto.response.RolResponseDTO;
import com.ofhcinema.GestionCine.mapper.RolMapper;
import com.ofhcinema.GestionCine.repository.RolRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RolService {

    private final RolRepository rolRepository;
    private final RolMapper rolMapper;

    public RolResponseDTO create(RolCreateDTO dto) {
        Rol rol = rolMapper.toEntity(dto);
        rol = rolRepository.save(rol);
        return rolMapper.toResponseDTO(rol);
    }

    @Transactional(readOnly = true)
    public List<RolResponseDTO> findAll() {
        return rolMapper.toResponseDTOList(rolRepository.findAll());
    }

    @Transactional(readOnly = true)
    public RolResponseDTO findById(Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado con id: " + id));
        return rolMapper.toResponseDTO(rol);
    }

    public RolResponseDTO update(Long id, RolCreateDTO dto) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado con id: " + id));
        rol.setNombre(dto.getNombre());
        rol = rolRepository.save(rol);
        return rolMapper.toResponseDTO(rol);
    }

    public void delete(Long id) {
        if (!rolRepository.existsById(id)) {
            throw new EntityNotFoundException("Rol no encontrado con id: " + id);
        }
        rolRepository.deleteById(id);
    }
}
