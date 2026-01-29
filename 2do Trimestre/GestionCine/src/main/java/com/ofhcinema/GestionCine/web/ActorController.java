package com.ofhcinema.GestionCine.web;

import com.ofhcinema.GestionCine.dto.create.ActorCreateDTO;
import com.ofhcinema.GestionCine.dto.response.ActorResponseDTO;
import com.ofhcinema.GestionCine.service.ActorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actores")
@RequiredArgsConstructor
public class ActorController {

    private final ActorService actorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActorResponseDTO create(@Valid @RequestBody ActorCreateDTO dto) {
        return actorService.create(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ActorResponseDTO> findAll() {
        return actorService.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ActorResponseDTO findById(@PathVariable Long id) {
        return actorService.findById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ActorResponseDTO update(@PathVariable Long id, @Valid @RequestBody ActorCreateDTO dto) {
        return actorService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        actorService.delete(id);
    }
}
