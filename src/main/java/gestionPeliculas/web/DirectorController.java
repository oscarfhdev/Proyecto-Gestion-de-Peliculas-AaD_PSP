package gestionPeliculas.web;

import gestionPeliculas.DTO.DirectorCreateUpdateDTO;
import gestionPeliculas.DTO.DirectorDTO;
import gestionPeliculas.service.DirectorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/directores")
@RequiredArgsConstructor
public class DirectorController {

    private final DirectorService service;

    // GET /directores → devuelve todos los directores
    @GetMapping
    public List<DirectorDTO> listar() {
        return service.listar();
    }

    // GET /directores/{id} → devuelve un director por id
    @GetMapping("/{id}")
    public DirectorDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // POST /directores → recibe DirectorCreateUpdateDTO, devuelve DirectorDTO
    @PostMapping
    public DirectorDTO agregar(@Valid @RequestBody DirectorCreateUpdateDTO director) {
        return service.agregar(director);
    }

    // PUT /directores/{id} → recibe DirectorCreateUpdateDTO, devuelve DirectorDTO
    @PutMapping("/{id}")
    public DirectorDTO actualizar(@PathVariable Long id, @Valid @RequestBody DirectorCreateUpdateDTO director) {
        return service.actualizar(id, director);
    }

    // DELETE /directores/{id} → elimina un director
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
