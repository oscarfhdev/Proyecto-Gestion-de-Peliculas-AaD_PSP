package gestionPeliculas.web;

import gestionPeliculas.DTO.SalaCreateUpdateDTO;
import gestionPeliculas.DTO.SalaDTO;
import gestionPeliculas.service.SalaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class SalaController {

    @Autowired
    private SalaService salaService;

    @GetMapping
    public List<SalaDTO> listar() {
        return salaService.listar();
    }

    @GetMapping("/{id}")
    public SalaDTO buscarPorId(@PathVariable Long id) {
        return salaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalaDTO agregar(@RequestBody @Valid SalaCreateUpdateDTO dto) {
        return salaService.agregar(dto);
    }

    @PutMapping("/{id}")
    public SalaDTO actualizar(@PathVariable Long id, @RequestBody @Valid SalaCreateUpdateDTO dto) {
        return salaService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        salaService.eliminar(id);
    }
}
