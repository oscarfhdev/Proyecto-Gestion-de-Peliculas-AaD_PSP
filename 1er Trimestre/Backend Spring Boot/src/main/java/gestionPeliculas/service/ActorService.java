package gestionPeliculas.service;

import gestionPeliculas.DTO.ActorCreateUpdateDTO;
import gestionPeliculas.DTO.ActorDTO;
import gestionPeliculas.DTO.mappers.ActorMapper;
import gestionPeliculas.domain.Actor;
import gestionPeliculas.repository.ActorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ActorService {

    @Autowired
    private ActorRepository actorRepository;

    @Autowired
    private ActorMapper mapper;

    // Listar todos los actores
    @Transactional(readOnly = true)
    public List<ActorDTO> listar() {
        return actorRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    // Buscar actor por id
    @Transactional(readOnly = true)
    public ActorDTO buscarPorId(Long id) {
        Actor actor = actorRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor no encontrado con id: " + id));
        return mapper.toDto(actor);
    }

    // Agregar un nuevo actor
    @Transactional
    public ActorDTO agregar(ActorCreateUpdateDTO dto) {
        Actor actor = mapper.toEntity(dto);
        actor = actorRepository.save(actor);
        return mapper.toDto(actor);
    }

    // Actualizar un actor existente
    @Transactional
    public ActorDTO actualizar(Long id, ActorCreateUpdateDTO dto) {
        Actor actorExistente = actorRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor no encontrado con id: " + id));

        mapper.updateEntity(dto, actorExistente);
        Actor actualizado = actorRepository.save(actorExistente);
        return mapper.toDto(actualizado);
    }

    // Eliminar un actor
    @Transactional
    public void eliminar(Long id) {
        boolean existe = actorRepository.existsById(id);
        if (!existe) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Actor no encontrado con id: " + id);
        }
        actorRepository.deleteById(id);
    }
}
