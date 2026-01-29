package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.SalaCreateDTO;
import com.ofhcinema.GestionCine.dto.response.SalaResponseDTO;
import com.ofhcinema.GestionCine.service.SalaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaService salaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalaResponseDTO create(@Valid @RequestBody SalaCreateDTO dto) {
        return salaService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<SalaResponseDTO> findAll() {
        return salaService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SalaResponseDTO findById(@PathVariable Long id) {
        return salaService.findById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SalaResponseDTO update(@PathVariable Long id, @Valid @RequestBody SalaCreateDTO dto) {
        return salaService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        salaService.delete(id);
    }
}
