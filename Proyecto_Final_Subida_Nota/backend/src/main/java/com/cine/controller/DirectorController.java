package com.cine.controller;

import com.cine.dto.director.DirectorInputDTO;
import com.cine.dto.director.DirectorOutputDTO;
import com.cine.servicio.DirectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/directores")
@RequiredArgsConstructor
public class DirectorController {
    private final DirectorService directorService;

    @GetMapping
    public ResponseEntity<List<DirectorOutputDTO>> getAll() {
        return ResponseEntity.ok(directorService.findAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<DirectorOutputDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(directorService.findById(id));
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DirectorOutputDTO> create(@Valid @RequestBody DirectorInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(directorService.save(dto));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DirectorOutputDTO> update(@PathVariable Long id, @Valid @RequestBody DirectorInputDTO dto) {
        return ResponseEntity.ok(directorService.update(id, dto));
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        directorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
