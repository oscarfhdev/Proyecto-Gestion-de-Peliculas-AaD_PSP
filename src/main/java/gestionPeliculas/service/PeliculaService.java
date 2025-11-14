package gestionPeliculas.service;

import gestionPeliculas.domain.Pelicula;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import java.util.concurrent.CompletableFuture;

@Service
@Getter
public class PeliculaService {
    private final List<Pelicula> peliculas = new ArrayList<>();

//    public PeliculaService() {
//        peliculas.add(new Pelicula(1L, "Interstellar", 169, LocalDate.of(2014, 11, 7),
//                "Exploradores espaciales buscan un nuevo hogar para la humanidad.", 10, null, null, null));
//        peliculas.add(new Pelicula(2L, "The Dark Knight", 152, LocalDate.of(2008, 7, 18),
//                "Batman enfrenta al Joker en una lucha por el alma de Gotham.", 5, null, null, null));
//        peliculas.add(new Pelicula(3L, "Soul", 100, LocalDate.of(2020, 12, 25),
//                "Un músico descubre el sentido de la vida más allá de la muerte.", 8, null, null, null));
//    }

    public List<Pelicula> listar() {
        return peliculas;
    }

    public Pelicula buscarPorId(Long id) {
        for (Pelicula p : peliculas) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        return null;
        /*
        * return peliculas.stream()                 // convierte la lista en un flujo de datos
        .filter(p -> p.getId().equals(id)) // se queda solo con las películas cuyo id coincide
        .findFirst()                       // toma la primera coincidencia (si existe)
        .orElse(null);                     // devuelve esa película o null si no hay
        * */
    }

    public void agregar(Pelicula pelicula) {
        peliculas.add(pelicula);
    }

    public String tareaLenta(String titulo) {
        try {
            System.out.println("Iniciando tarea para " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000); // simula proceso lento (3 segundos)
            System.out.println("Terminando tarea para " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "Procesada " + titulo;
    }

    @Async("taskExecutor")
    public CompletableFuture<String> tareaLenta2(String titulo) {
        try {
            System.out.println("Iniciando " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    public List<Pelicula> devolverPeliculasPuntuacion(int puntuacionMinima){
        List<Pelicula> totalPeliculas = this.listar();

        List<Pelicula> peliculasFiltradas = new ArrayList<>();
        for(Pelicula pelicula : peliculas){
            if (pelicula.getPuntuacion() >= puntuacionMinima) peliculasFiltradas.add(pelicula);
        }
        return peliculasFiltradas;
    }
}
