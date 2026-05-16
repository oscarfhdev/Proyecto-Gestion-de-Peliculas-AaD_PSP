package com.cine.controller;

import com.cine.dto.pelicula.PeliculaInputDTO;
import com.cine.dto.pelicula.PeliculaOutputDTO;
import com.cine.servicio.PeliculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService peliculaService;

    /** PÚBLICO - Catálogo de películas */
    @GetMapping
    public ResponseEntity<List<PeliculaOutputDTO>> getAll() {
        return ResponseEntity.ok(peliculaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PeliculaOutputDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(peliculaService.findById(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PeliculaOutputDTO>> search(@RequestParam String titulo) {
        return ResponseEntity.ok(peliculaService.search(titulo));
    }

    /** SOLO ADMIN */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PeliculaOutputDTO> create(@Valid @RequestBody PeliculaInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(peliculaService.save(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PeliculaOutputDTO> update(@PathVariable Long id, @Valid @RequestBody PeliculaInputDTO dto) {
        return ResponseEntity.ok(peliculaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        peliculaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
