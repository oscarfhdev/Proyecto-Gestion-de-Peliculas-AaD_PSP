package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.PeliculaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.PeliculaResponseDTO;
import com.ofhcinema.GestionCine.service.PeliculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService peliculaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PeliculaResponseDTO create(@Valid @RequestBody PeliculaCreateDTO dto) {
        return peliculaService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<PeliculaResponseDTO> findAll() {
        return peliculaService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PeliculaResponseDTO findById(@PathVariable Long id) {
        return peliculaService.findById(id);
    }

    @GetMapping("/director/{directorId}")
    @ResponseStatus(HttpStatus.OK)
    public List<PeliculaResponseDTO> findByDirector(@PathVariable Long directorId) {
        return peliculaService.findByDirectorId(directorId);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PeliculaResponseDTO update(@PathVariable Long id, @Valid @RequestBody PeliculaCreateDTO dto) {
        return peliculaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        peliculaService.delete(id);
    }
}
