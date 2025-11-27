package gestionPeliculas.web;

import gestionPeliculas.DTO.CriticaCreateUpdateDTO;
import gestionPeliculas.service.CriticaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/criticas")
@RequiredArgsConstructor
public class CriticaController {

    private final CriticaService service;

    @GetMapping
    public List<CriticaCreateUpdateDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CriticaCreateUpdateDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public CriticaCreateUpdateDTO agregar(@Valid @RequestBody CriticaCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public CriticaCreateUpdateDTO actualizar(@PathVariable Long id, @Valid @RequestBody CriticaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
