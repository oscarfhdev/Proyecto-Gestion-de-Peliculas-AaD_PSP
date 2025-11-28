package gestionPeliculas.web;

import gestionPeliculas.DTO.ActorCreateUpdateDTO;
import gestionPeliculas.DTO.ActorDTO;
import gestionPeliculas.service.ActorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actores")
@RequiredArgsConstructor
public class ActorController {

    private final ActorService service;

    // GET /actores → devuelve todos los actores
    @GetMapping
    public List<ActorDTO> listar() {
        return service.listar();
    }

    // GET /actores/{id} → devuelve ActorDTO
    @GetMapping("/{id}")
    public ActorDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    // POST /actores → recibe ActorCreateUpdateDTO, devuelve ActorDTO
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActorDTO agregar(@Valid @RequestBody ActorCreateUpdateDTO actor) {
        return service.agregar(actor);
    }

    // PUT /actores/{id} → recibe ActorCreateUpdateDTO, devuelve ActorDTO
    @PutMapping("/{id}")
    public ActorDTO actualizar(@PathVariable Long id, @Valid @RequestBody ActorCreateUpdateDTO actor) {
        return service.actualizar(id, actor);
    }

    // DELETE /actores/{id} → elimina un actor
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
