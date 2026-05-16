package com.cine.controller;

import com.cine.dto.usuario.UsuarioInputDTO;
import com.cine.dto.usuario.UsuarioOutputDTO;
import com.cine.servicio.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    /** USER - Ver mi propio perfil */
    @GetMapping("/me")
    public ResponseEntity<UsuarioOutputDTO> getMiPerfil() {
        return ResponseEntity.ok(usuarioService.findMiPerfil());
    }

    /** ADMIN - Ver todos los usuarios */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioOutputDTO>> getAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioOutputDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioOutputDTO> create(@Valid @RequestBody UsuarioInputDTO dto) {
        return ResponseEntity.ok(usuarioService.save(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioOutputDTO> update(@PathVariable Long id, @Valid @RequestBody UsuarioInputDTO dto) {
        return ResponseEntity.ok(usuarioService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
