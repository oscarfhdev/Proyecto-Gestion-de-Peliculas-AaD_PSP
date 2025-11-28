package gestionPeliculas.service;

import gestionPeliculas.DTO.FuncionCreateUpdateDTO;
import gestionPeliculas.DTO.FuncionDTO;
import gestionPeliculas.DTO.mappers.FuncionMapper;
import gestionPeliculas.domain.Funcion;
import gestionPeliculas.repository.FuncionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuncionService {

    private final FuncionRepository funcionRepository;
    private final FuncionMapper mapper;

    public List<FuncionDTO> listar() {
        return funcionRepository.findAll()
            .stream()
            .map(mapper::toDto)
            .toList();
    }

    public FuncionDTO buscarPorId(Long id) {
        Funcion funcion = funcionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada"));
        return mapper.toDto(funcion);
    }

    public FuncionDTO agregar(FuncionCreateUpdateDTO dto) {
        Funcion funcion = mapper.toEntity(dto);
        funcion = funcionRepository.save(funcion);
        return mapper.toDto(funcion);
    }

    public FuncionDTO actualizar(Long id, FuncionCreateUpdateDTO dto) {
        Funcion existente = funcionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada"));

        mapper.updateEntity(dto, existente);
        existente = funcionRepository.save(existente);

        return mapper.toDto(existente);
    }

    public void eliminar(Long id) {
        if (!funcionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Función no encontrada");
        }
        funcionRepository.deleteById(id);
    }
}
