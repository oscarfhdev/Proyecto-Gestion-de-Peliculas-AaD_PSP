package com.cine.servicio;

import com.cine.dto.actor.ActorInputDTO;
import com.cine.dto.actor.ActorOutputDTO;
import com.cine.mapper.ActorMapper;
import com.cine.modelo.Actor;
import com.cine.repositorio.ActorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActorService {
    private final ActorRepository actorRepository;
    private final ActorMapper actorMapper;

    public List<ActorOutputDTO> findAll() {
        return actorRepository.findAll().stream().map(actorMapper::toDTO).collect(Collectors.toList());
    }
    public ActorOutputDTO findById(Long id) {
        return actorRepository.findById(id).map(actorMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Actor no encontrado con ID: " + id));
    }
    public ActorOutputDTO save(ActorInputDTO dto) {
        return actorMapper.toDTO(actorRepository.save(actorMapper.toEntity(dto)));
    }
    public ActorOutputDTO update(Long id, ActorInputDTO dto) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Actor no encontrado con ID: " + id));
        actorMapper.update(dto, actor);
        return actorMapper.toDTO(actorRepository.save(actor));
    }
    public void deleteById(Long id) {
        if (!actorRepository.existsById(id)) throw new RuntimeException("Actor no encontrado con ID: " + id);
        actorRepository.deleteById(id);
    }
}
