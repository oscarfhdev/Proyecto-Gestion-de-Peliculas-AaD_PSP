package gestionPeliculas.web;

import gestionPeliculas.DTO.PlataformaCreateUpdateDTO;
import gestionPeliculas.DTO.PlataformaDTO;
import gestionPeliculas.service.PlataformaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plataformas")
@RequiredArgsConstructor
public class PlataformaController {

    private final PlataformaService service;

    @GetMapping
    public List<PlataformaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PlataformaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public PlataformaDTO agregar(@Valid @RequestBody PlataformaCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public PlataformaDTO actualizar(@PathVariable Long id, @Valid @RequestBody PlataformaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
