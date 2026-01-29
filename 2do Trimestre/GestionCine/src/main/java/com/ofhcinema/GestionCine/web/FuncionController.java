package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.FuncionCreateDTO;
import com.ofhcinema.GestionCine.dto.response.FuncionResponseDTO;
import com.ofhcinema.GestionCine.service.FuncionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funciones")
@RequiredArgsConstructor
public class FuncionController {

    private final FuncionService funcionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FuncionResponseDTO create(@Valid @RequestBody FuncionCreateDTO dto) {
        return funcionService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<FuncionResponseDTO> findAll() {
        return funcionService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public FuncionResponseDTO findById(@PathVariable Long id) {
        return funcionService.findById(id);
    }

    @GetMapping("/sala/{salaId}")
    @ResponseStatus(HttpStatus.OK)
    public List<FuncionResponseDTO> findBySala(@PathVariable Long salaId) {
        return funcionService.findBySalaId(salaId);
    }

    @GetMapping("/pelicula/{peliculaId}")
    @ResponseStatus(HttpStatus.OK)
    public List<FuncionResponseDTO> findByPelicula(@PathVariable Long peliculaId) {
        return funcionService.findByPeliculaId(peliculaId);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public FuncionResponseDTO update(@PathVariable Long id, @Valid @RequestBody FuncionCreateDTO dto) {
        return funcionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        funcionService.delete(id);
    }
}
