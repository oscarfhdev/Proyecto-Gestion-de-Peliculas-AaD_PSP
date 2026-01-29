package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.VentaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.VentaResponseDTO;
import com.ofhcinema.GestionCine.service.VentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VentaResponseDTO create(@Valid @RequestBody VentaCreateDTO dto) {
        return ventaService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<VentaResponseDTO> findAll() {
        return ventaService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public VentaResponseDTO findById(@PathVariable Long id) {
        return ventaService.findById(id);
    }

    @GetMapping("/usuario/{usuarioId}")
    @ResponseStatus(HttpStatus.OK)
    public List<VentaResponseDTO> findByUsuario(@PathVariable Long usuarioId) {
        return ventaService.findByUsuarioId(usuarioId);
    }

    @GetMapping("/estado/{estado}")
    @ResponseStatus(HttpStatus.OK)
    public List<VentaResponseDTO> findByEstado(@PathVariable String estado) {
        return ventaService.findByEstado(estado);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public VentaResponseDTO update(@PathVariable Long id, @Valid @RequestBody VentaCreateDTO dto) {
        return ventaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        ventaService.delete(id);
    }
}
