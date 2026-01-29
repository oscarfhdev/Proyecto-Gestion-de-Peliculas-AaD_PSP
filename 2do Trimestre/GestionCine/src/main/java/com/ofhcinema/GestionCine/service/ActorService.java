package com.ofhcinema.GestionCine.service;

import com.ofhcinema.GestionCine.domain.Actor;
import com.ofhcinema.GestionCine.dto.create.ActorCreateDTO;
import com.ofhcinema.GestionCine.dto.response.ActorResponseDTO;
import com.ofhcinema.GestionCine.mapper.ActorMapper;
import com.ofhcinema.GestionCine.repository.ActorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ActorService {

    private final ActorRepository actorRepository;
    private final ActorMapper actorMapper;

    public ActorResponseDTO create(ActorCreateDTO dto) {
        Actor actor = actorMapper.toEntity(dto);
        actor = actorRepository.save(actor);
        return actorMapper.toResponseDTO(actor);
    }

    @Transactional(readOnly = true)
    public List<ActorResponseDTO> findAll() {
        return actorMapper.toResponseDTOList(actorRepository.findAll());
    }

    @Transactional(readOnly = true)
    public ActorResponseDTO findById(Long id) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Actor no encontrado con id: " + id));
        return actorMapper.toResponseDTO(actor);
    }

    public ActorResponseDTO update(Long id, ActorCreateDTO dto) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Actor no encontrado con id: " + id));
        actor.setNombre(dto.getNombre());
        actor = actorRepository.save(actor);
        return actorMapper.toResponseDTO(actor);
    }

    public void delete(Long id) {
        if (!actorRepository.existsById(id)) {
            throw new EntityNotFoundException("Actor no encontrado con id: " + id);
        }
        actorRepository.deleteById(id);
    }
}
