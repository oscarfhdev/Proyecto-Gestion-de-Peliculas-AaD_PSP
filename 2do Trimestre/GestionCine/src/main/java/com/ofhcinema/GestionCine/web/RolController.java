package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.RolCreateDTO;
import com.ofhcinema.GestionCine.dto.response.RolResponseDTO;
import com.ofhcinema.GestionCine.service.RolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService rolService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RolResponseDTO create(@Valid @RequestBody RolCreateDTO dto) {
        return rolService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<RolResponseDTO> findAll() {
        return rolService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RolResponseDTO findById(@PathVariable Long id) {
        return rolService.findById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RolResponseDTO update(@PathVariable Long id, @Valid @RequestBody RolCreateDTO dto) {
        return rolService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        rolService.delete(id);
    }
}
