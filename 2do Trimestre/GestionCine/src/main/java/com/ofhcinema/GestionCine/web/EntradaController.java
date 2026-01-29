package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.EntradaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.EntradaResponseDTO;
import com.ofhcinema.GestionCine.service.EntradaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entradas")
@RequiredArgsConstructor
public class EntradaController {

    private final EntradaService entradaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EntradaResponseDTO create(@Valid @RequestBody EntradaCreateDTO dto) {
        return entradaService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<EntradaResponseDTO> findAll() {
        return entradaService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EntradaResponseDTO findById(@PathVariable Long id) {
        return entradaService.findById(id);
    }

    @GetMapping("/codigo/{codigo}")
    @ResponseStatus(HttpStatus.OK)
    public EntradaResponseDTO findByCodigo(@PathVariable String codigo) {
        return entradaService.findByCodigo(codigo);
    }

    @GetMapping("/venta/{ventaId}")
    @ResponseStatus(HttpStatus.OK)
    public List<EntradaResponseDTO> findByVenta(@PathVariable Long ventaId) {
        return entradaService.findByVentaId(ventaId);
    }

    @GetMapping("/funcion/{funcionId}")
    @ResponseStatus(HttpStatus.OK)
    public List<EntradaResponseDTO> findByFuncion(@PathVariable Long funcionId) {
        return entradaService.findByFuncionId(funcionId);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EntradaResponseDTO update(@PathVariable Long id, @Valid @RequestBody EntradaCreateDTO dto) {
        return entradaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        entradaService.delete(id);
    }
}
