package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.DirectorCreateDTO;
import com.ofhcinema.GestionCine.dto.response.DirectorResponseDTO;
import com.ofhcinema.GestionCine.service.DirectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/directores")
@RequiredArgsConstructor
public class DirectorController {

    private final DirectorService directorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DirectorResponseDTO create(@Valid @RequestBody DirectorCreateDTO dto) {
        return directorService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<DirectorResponseDTO> findAll() {
        return directorService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DirectorResponseDTO findById(@PathVariable Long id) {
        return directorService.findById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DirectorResponseDTO update(@PathVariable Long id, @Valid @RequestBody DirectorCreateDTO dto) {
        return directorService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        directorService.delete(id);
    }
}
