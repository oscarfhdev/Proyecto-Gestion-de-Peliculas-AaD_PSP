package gestionPeliculas.web;

import gestionPeliculas.DTO.CriticaCreateUpdateDTO;
import gestionPeliculas.DTO.CriticaDTO;
import gestionPeliculas.service.CriticaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/criticas")
@RequiredArgsConstructor
public class CriticaController {

    private final CriticaService service;

    @GetMapping
    public List<CriticaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CriticaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriticaDTO agregar(@Valid @RequestBody CriticaCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public CriticaDTO actualizar(@PathVariable Long id, @Valid @RequestBody CriticaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
