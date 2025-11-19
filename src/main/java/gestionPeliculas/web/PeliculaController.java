package gestionPeliculas.web;


import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.concurrent.CompletableFuture;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

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

    // Al acceder esta ruta solo nos devuelve las películas con puntuación igual o mayor a la requerida
    @GetMapping("/puntuacion/{puntuacion}")
    public List<Pelicula> peliculasPuntuacionMinima (@PathVariable int puntuacion){
        return service.devolverPeliculasPuntuacion(puntuacion);
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

    // Ejercicio 1
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

    // Ejercicio 2
    @GetMapping("/reproducirAsyncAleatorio")
    public String reproducirAsyncAleatorio() {
        long inicio = System.currentTimeMillis();

        var t1 = service.reproducir("🍿 Interstellar");
        var t2 = service.reproducir("🦇 The Dark Knight");
        var t3 = service.reproducir("🎵 Soul");

        // Espera a que terminen todas las tareas
        CompletableFuture.allOf(t1, t2, t3).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono & aleatorio): " + (fin - inicio) + " ms";
    }

    // Lo podemos hacer también con un get
    // Ejercicio 3
    @PostMapping("/cargarArchivosPeliculas")
    public ResponseEntity<?> cargarArchivosPeliculas() throws IOException {

        /* Podemos añadir la verficiación y comprobar por el nombre si esas películas ya han sido añadidas anteriormente
            comprobaríamos si el título coincide, en el caso de que lo haga
        */
        service.importarCarpeta("src/main/resources/archivos_peliculas");
        return ResponseEntity.status(HttpStatus.CREATED).body("Archivos importados correctamente");
    }


    // Ejercicio 4
    @GetMapping("/oscar/{numeroJurados}")
    public HashMap<String, Integer> votarOscar(@PathVariable int numeroJurados){
        ConcurrentHashMap<String, Integer> votos = new ConcurrentHashMap<>();

        return service.simularVotacionesAleatorias(numeroJurados);
    }
}
