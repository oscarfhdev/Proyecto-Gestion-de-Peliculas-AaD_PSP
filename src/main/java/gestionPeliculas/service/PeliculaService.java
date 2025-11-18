package gestionPeliculas.service;

import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.repository.PeliculaRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Stream;

@Service
@Getter
@RequiredArgsConstructor
public class PeliculaService {

    // PORQUE PRIVATE FINAL :(
    private final PeliculaRepository peliculaRepository;

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
        return peliculaRepository.findAll();
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

    @Async("taskExecutor")
    public CompletableFuture<String> reproducir(String titulo) {
        long inicio = System.currentTimeMillis();
        try {
            System.out.println("Iniciando " + titulo + " en " + Thread.currentThread().getName());
            int milisegundosAleatorios = new Random().nextInt((5)+1) * 1000;
            Thread.sleep(milisegundosAleatorios);
            System.out.println("Terminando película " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        long tiempoTotalReprduccion = System.currentTimeMillis() - inicio;
        System.out.println("Procesada la película: " + titulo + " en " + tiempoTotalReprduccion + " milisegundos");
        return CompletableFuture.completedFuture("Procesada la película: " + titulo + " en " + tiempoTotalReprduccion + " milisegundos");
    }


    public List<Pelicula> devolverPeliculasPuntuacion(int puntuacionMinima){
        List<Pelicula> totalPeliculas = this.listar();

        List<Pelicula> peliculasFiltradas = new ArrayList<>();
        for(Pelicula pelicula : peliculas){
            if (pelicula.getPuntuacion() >= puntuacionMinima) peliculasFiltradas.add(pelicula);
        }
        return peliculasFiltradas;
    }

    public void importarCarpeta(String rutaCarpeta) throws IOException {
        long inicio = System.currentTimeMillis();
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        try (Stream<Path> paths = Files.list(Paths.get(rutaCarpeta))) {
            paths.filter(Files::isRegularFile).forEach(path -> {
                String nombre = path.toString().toLowerCase();
                if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) {
                    futures.add(importarCsvAsync(path));
                } else if (nombre.endsWith(".xml")) {
                    futures.add(importarXmlAsync(path));
                }
            });
        }
        // Esperar a que terminen todas las tareas asíncronas
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long fin = System.currentTimeMillis();
        System.out.println("Importación completa en " + (fin - inicio) + " ms");
    }


    @Async("taskExecutor")
    public CompletableFuture<Void> importarCsvAsync(Path fichero) {
        try {
            System.out.println("Procesando CSV: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>();

            List<String> lineas = Files.readAllLines(fichero);
            lineas.remove(0); // suponemos encabezado

            for (String linea : lineas) {
                String[] campos = linea.split(";");
                Pelicula p = new Pelicula();
                p.setTitulo(campos[0]);
                p.setDuracion(Integer.parseInt(campos[1]));
                p.setFechaEstreno(LocalDate.parse(campos[2]));
                p.setSinopsis(campos[3]);
                lista.add(p);
            }

            peliculaRepository.saveAll(lista);

            System.out.println("Finalizado CSV: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en CSV " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    @Async("taskExecutor")
    public CompletableFuture<Void> importarXmlAsync(Path fichero) {
        try {
            System.out.println("Procesando XML: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            Document doc = builder.parse(fichero.toFile());
            NodeList nodos = doc.getElementsByTagName("pelicula");

            for (int i = 0; i < nodos.getLength(); i++) {
                Element e = (Element) nodos.item(i);

                Pelicula p = new Pelicula();
                p.setTitulo(e.getElementsByTagName("titulo").item(0).getTextContent());
                p.setDuracion(Integer.parseInt(e.getElementsByTagName("duracion").item(0).getTextContent()));
                p.setFechaEstreno(LocalDate.parse(e.getElementsByTagName("fechaEstreno").item(0).getTextContent()));
                p.setSinopsis(e.getElementsByTagName("sinopsis").item(0).getTextContent());

                lista.add(p);
            }

            peliculaRepository.saveAll(lista);

            System.out.println("Finalizado XML: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en XML " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }
}
