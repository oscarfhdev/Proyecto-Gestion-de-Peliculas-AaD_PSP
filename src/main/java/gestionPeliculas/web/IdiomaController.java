package gestionPeliculas.web;

import gestionPeliculas.DTO.IdiomaCreateUpdateDTO;
import gestionPeliculas.DTO.IdiomaDTO;
import gestionPeliculas.service.IdiomaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/idiomas")
@RequiredArgsConstructor
public class IdiomaController {

    private final IdiomaService service;

    @GetMapping
    public List<IdiomaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public IdiomaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public IdiomaDTO agregar(@Valid @RequestBody IdiomaCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public IdiomaDTO actualizar(@PathVariable Long id, @Valid @RequestBody IdiomaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
