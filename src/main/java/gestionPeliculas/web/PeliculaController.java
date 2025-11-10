package gestionPeliculas.web;


import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.CompletableFuture;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {
    private final PeliculaService service;

    @GetMapping
    public List<Pelicula> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Pelicula buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public void agregar(@RequestBody Pelicula pelicula) {
        service.agregar(pelicula);
    }

    @GetMapping("/procesar")
    public String procesarPeliculas() {
        long inicio = System.currentTimeMillis();
        service.tareaLenta("Interstellar");
        service.tareaLenta("The Dark Knight");
        service.tareaLenta("Soul");
        long fin = System.currentTimeMillis();
        return "Tiempo total: " + (fin - inicio) + " ms";
    }

    @GetMapping("/procesarAsync")
    public String procesarAsync() {
        long inicio = System.currentTimeMillis();

        var t1 = service.tareaLenta2("🍿 Interstellar");
        var t2 = service.tareaLenta2("🦇 The Dark Knight");
        var t3 = service.tareaLenta2("🎵 Soul");

        // Espera a que terminen todas las tareas
        CompletableFuture.allOf(t1, t2, t3).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono): " + (fin - inicio) + " ms";
    }

    // Al acceder esta ruta solo nos devuelve las películas con puntuación igual o mayor a la requerida
    @GetMapping("/puntuacion/{puntuacion}")
    public List<Pelicula> peliculasPuntuacionMinima (@PathVariable int puntuacion){
        return service.devolverPeliculasPuntuacion(puntuacion);
    }

}
