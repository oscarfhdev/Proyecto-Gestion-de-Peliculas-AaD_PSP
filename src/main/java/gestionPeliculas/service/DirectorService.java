package gestionPeliculas.service;

import gestionPeliculas.DTO.DirectorCreateUpdateDTO;
import gestionPeliculas.DTO.DirectorDTO;
import gestionPeliculas.DTO.DirectorMapper;
import gestionPeliculas.domain.Director;
import gestionPeliculas.repository.DirectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DirectorService {

    @Autowired
    private DirectorRepository directorRepository;

    @Autowired
    private DirectorMapper mapper;

    // Devuelve una lista de tipo directorDTO con los directores
    public List<DirectorDTO> listar() {
        return directorRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    // Nos retorna el director si lo encuentra, de lo contrario lanza código 404
    public DirectorDTO buscarPorId(Long id) {
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Director no encontrado con id: " + id));
        return mapper.toDto(director);
    }

    @Transactional
    // Agrega la el director, si no es posible se revierte (transacctional)
    public DirectorDTO agregar(DirectorCreateUpdateDTO dto) {
        Director director = mapper.toEntity(dto);
        director = directorRepository.save(director);
        return mapper.toDto(director);
    }

    @Transactional
    // Actualiza el director, si no es posible se revierte (transacctional). Si no la encuentra lanza 404
    public DirectorDTO actualizar(Long id, DirectorCreateUpdateDTO dto) {
        Director directorExistente = directorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Director no encontrado con id: " + id));

        mapper.updateEntity(dto, directorExistente);
        Director actualizado = directorRepository.save(directorExistente);
        return mapper.toDto(actualizado);
    }

    @Transactional
    // DELETE /directores/{id} → elimina un director
    public void eliminar(Long id) {
        boolean existe = directorRepository.existsById(id);
        if (!existe) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Director no encontrado con id: " + id);
        }
        directorRepository.deleteById(id);
    }
}
