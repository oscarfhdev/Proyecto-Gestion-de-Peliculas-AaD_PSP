package com.cine.controller;

import com.cine.dto.sala.SalaInputDTO;
import com.cine.dto.sala.SalaOutputDTO;
import com.cine.servicio.SalaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/salas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SalaController {

    private final SalaService salaService;

    @GetMapping
    public ResponseEntity<List<SalaOutputDTO>> getAll() {
        return ResponseEntity.ok(salaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaOutputDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SalaOutputDTO> create(@Valid @RequestBody SalaInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salaService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaOutputDTO> update(@PathVariable Long id, @Valid @RequestBody SalaInputDTO dto) {
        return ResponseEntity.ok(salaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
