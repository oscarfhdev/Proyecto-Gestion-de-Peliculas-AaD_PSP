package com.cine.controller;

import com.cine.dto.funcion.FuncionInputDTO;
import com.cine.dto.funcion.FuncionOutputDTO;
import com.cine.servicio.FuncionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/funciones")
@RequiredArgsConstructor
public class FuncionController {

    private final FuncionService funcionService;

    /** PÚBLICO - Cartelera */
    @GetMapping
    public ResponseEntity<List<FuncionOutputDTO>> getAll() {
        return ResponseEntity.ok(funcionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionOutputDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(funcionService.findById(id));
    }

    @GetMapping("/{id}/ocupados")
    public ResponseEntity<List<Map<String, Integer>>> getOcupados(@PathVariable Long id) {
        return ResponseEntity.ok(funcionService.getAsientosOcupados(id));
    }

    @GetMapping("/pelicula/{peliculaId}")
    public ResponseEntity<List<FuncionOutputDTO>> getByPelicula(@PathVariable Long peliculaId) {
        return ResponseEntity.ok(funcionService.findByPeliculaId(peliculaId));
    }

    /** SOLO ADMIN */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FuncionOutputDTO> create(@Valid @RequestBody FuncionInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(funcionService.save(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FuncionOutputDTO> update(@PathVariable Long id, @Valid @RequestBody FuncionInputDTO dto) {
        return ResponseEntity.ok(funcionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        funcionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
