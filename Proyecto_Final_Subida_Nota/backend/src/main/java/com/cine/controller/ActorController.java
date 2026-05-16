package com.cine.controller;

import com.cine.dto.actor.ActorInputDTO;
import com.cine.dto.actor.ActorOutputDTO;
import com.cine.servicio.ActorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/actores")
@RequiredArgsConstructor
public class ActorController {
    private final ActorService actorService;

    @GetMapping
    public ResponseEntity<List<ActorOutputDTO>> getAll() {
        return ResponseEntity.ok(actorService.findAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ActorOutputDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(actorService.findById(id));
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ActorOutputDTO> create(@Valid @RequestBody ActorInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(actorService.save(dto));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ActorOutputDTO> update(@PathVariable Long id, @Valid @RequestBody ActorInputDTO dto) {
        return ResponseEntity.ok(actorService.update(id, dto));
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        actorService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
