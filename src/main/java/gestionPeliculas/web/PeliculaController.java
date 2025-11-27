package gestionPeliculas.web;


import gestionPeliculas.DTO.PeliculaCreateUpdateDTO;
import gestionPeliculas.DTO.PeliculaDTO;
import gestionPeliculas.service.PeliculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.concurrent.CompletableFuture;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService service;

    @GetMapping
    // GET /peliculas → devuelve todas las películas
    public List<PeliculaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    // GET /peliculas/{id} → devuelve PeliculaDТО
    public PeliculaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    // POST /peliculas → recibe PeliculaCreateUpdateDTO, devuelve PeliculaDTO
    public PeliculaDTO agregar(@Valid @RequestBody PeliculaCreateUpdateDTO pelicula) {
        return service.agregar(pelicula);
    }

    @PutMapping("/{id}")
    // PUT /peliculas/{id} → recibe PeliculaCreateUpdateDTO, devuelve PeliculaDTO
    public PeliculaDTO actualizar(@PathVariable Long id, @Valid @RequestBody PeliculaCreateUpdateDTO pelicula) {
        return service.actualizar(id, pelicula);
    }

    @DeleteMapping("/{id}")
    // DELETE /peliculas/{id} → no necesita DTO (normalmente void o un mensaje)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    // Al acceder esta ruta solo nos devuelve las películas con puntuación igual o mayor a la requerida
    @GetMapping("/puntuacion/{puntuacion}")
    public List<PeliculaDTO> peliculasPuntuacionMinima (@PathVariable int puntuacion){
        return service.devolverPeliculasPuntuacion(puntuacion);
    }




    // ------------------------------------------------------------------------------------------------
    //PSP ---------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------
    // Ejercicio 1a
    @GetMapping("/procesar")
    public String procesarPeliculas() {
        long inicio = System.currentTimeMillis();
        service.tareaLenta("Interstellar");
        service.tareaLenta("The Dark Knight");
        service.tareaLenta("Soul");
        long fin = System.currentTimeMillis();
        return "Tiempo total: " + (fin - inicio) + " ms";
    }

    // Ejercicio 1b
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
        // Llamamos al servicio pasándlo el número de jurados, obtenidos a través de la URL
        return service.simularVotacionesAleatorias(numeroJurados);
    }
}
