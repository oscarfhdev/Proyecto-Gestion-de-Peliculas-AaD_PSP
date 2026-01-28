package gestionPeliculas.web;

import gestionPeliculas.DTO.FuncionCreateUpdateDTO;
import gestionPeliculas.DTO.FuncionDTO;
import gestionPeliculas.service.FuncionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funciones")
@RequiredArgsConstructor
public class FuncionController {

    private final FuncionService service;

    @GetMapping
    public List<FuncionDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public FuncionDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FuncionDTO agregar(@Valid @RequestBody FuncionCreateUpdateDTO dto) {
        return service.agregar(dto);
    }

    @PutMapping("/{id}")
    public FuncionDTO actualizar(@PathVariable Long id, @Valid @RequestBody FuncionCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
