package gestionPeliculas.service;

import gestionPeliculas.DTO.CategoriaCreateUpdateDTO;
import gestionPeliculas.DTO.CategoriaDTO;
import gestionPeliculas.DTO.mappers.CategoriaMapper;
import gestionPeliculas.domain.Categoria;
import gestionPeliculas.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaMapper mapper;

    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public CategoriaDTO buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con id: " + id));
        return mapper.toDto(categoria);
    }

    @Transactional
    public CategoriaDTO agregar(CategoriaCreateUpdateDTO dto) {
        Categoria categoria = mapper.toEntity(dto);
        categoria = categoriaRepository.save(categoria);
        return mapper.toDto(categoria);
    }

    @Transactional
    public CategoriaDTO actualizar(Long id, CategoriaCreateUpdateDTO dto) {
        Categoria categoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con id: " + id));

        mapper.updateEntity(dto, categoriaExistente);
        Categoria actualizado = categoriaRepository.save(categoriaExistente);
        return mapper.toDto(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        boolean existe = categoriaRepository.existsById(id);
        if (!existe) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada con id: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
