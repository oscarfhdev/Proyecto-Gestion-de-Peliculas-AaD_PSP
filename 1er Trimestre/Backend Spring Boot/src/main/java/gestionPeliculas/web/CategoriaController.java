package gestionPeliculas.web;

import gestionPeliculas.DTO.CategoriaCreateUpdateDTO;
import gestionPeliculas.DTO.CategoriaDTO;
import gestionPeliculas.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService service;

    @GetMapping
    public List<CategoriaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CategoriaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaDTO agregar(@Valid @RequestBody CategoriaCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public CategoriaDTO actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}