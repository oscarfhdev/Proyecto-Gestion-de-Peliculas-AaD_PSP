package gestionPeliculas.service;

import gestionPeliculas.domain.Pelicula;
import gestionPeliculas.repository.PeliculaRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.stream.Stream;

@Service
@Getter
public class PeliculaService {

    // final si hacemos @RequireArgsConstructor
    @Autowired
    private PeliculaRepository peliculaRepository;

    @Autowired
    @Lazy
    private PeliculaService self;

    private final List<Pelicula> peliculas = new ArrayList<>();

    public PeliculaService() {
        peliculas.add(new Pelicula(1L, "Interstellar", 169, LocalDate.of(2014, 11, 7),
                "Exploradores espaciales buscan un nuevo hogar para la humanidad.", 10, null, null, null));
        peliculas.add(new Pelicula(2L, "The Dark Knight", 152, LocalDate.of(2008, 7, 18),
                "Batman enfrenta al Joker en una lucha por el alma de Gotham.", 5, null, null, null));
        peliculas.add(new Pelicula(3L, "Soul", 100, LocalDate.of(2020, 12, 25),
                "Un músico descubre el sentido de la vida más allá de la muerte.", 8, null, null, null));
    }

    // En función de que queramos hacer podemos retornar el contenido de la base de datos o el contenido de la lista
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

    // Tarea 1a
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
    // Tarea 1b
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

    // Tarea 2
    @Async("taskExecutor")
    // Retornamos un completableFuture de string
    public CompletableFuture<String> reproducir(String titulo) {
        long inicio = System.currentTimeMillis();
        try {
            System.out.println("Iniciando " + titulo + " en " + Thread.currentThread().getName());
            // Con esto reproducimos durante un periodo aleatorio 1-5 segundos
            int milisegundosAleatorios = (new Random().nextInt(5)+1) * 1000;
            Thread.sleep(milisegundosAleatorios);

            System.out.println("Terminando película " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        // El tiempo es el actual - el inicial
        long tiempoTotalReproduccion = System.currentTimeMillis() - inicio;
        System.out.println("Procesada la película: " + titulo + " en " + tiempoTotalReproduccion + " milisegundos");

        // Retornamos la tarea cuando se completa
        return CompletableFuture.completedFuture("Procesada la película: " + titulo + " en " + tiempoTotalReproduccion + " milisegundos");
    }

    // Ejercicio mandado en clase para devolver las películas con mejor puntuación
    public List<Pelicula> devolverPeliculasPuntuacion(int puntuacionMinima){

        List<Pelicula> peliculasFiltradas = new ArrayList<>();
        for(Pelicula pelicula : this.listar()){
            if (pelicula.getPuntuacion() >= puntuacionMinima) peliculasFiltradas.add(pelicula);
        }
        return peliculasFiltradas;
    }

    // Ejercicio 3, llama a importarCsvAsync & importarCsvAsync
    public void importarCarpeta(String rutaCarpeta) throws IOException {
        long inicio = System.currentTimeMillis();
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        try (Stream<Path> paths = Files.list(Paths.get(rutaCarpeta))) {
            paths.filter(Files::isRegularFile).forEach(path -> {
                String nombre = path.toString().toLowerCase();
                if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) {
                    futures.add(this.self.importarCsvAsync(path));
                } else if (nombre.endsWith(".xml")) {
                    futures.add(this.self.importarCsvAsync(path));
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

            this.peliculaRepository.saveAll(lista);

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

            this.peliculaRepository.saveAll(lista);

            System.out.println("Finalizado XML: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en XML " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }


    // Ejercicio 4, llamamos a votarComoJurado()
    public HashMap<String, Integer> simularVotacionesAleatorias(int numeroVotaciones) {
        long inicio = System.currentTimeMillis();

        List<Pelicula> peliculasCandidatas = this.listar(); // listamos todas las películas guardadas

        // Mapa concurrente para los votos
        ConcurrentHashMap<String, Integer> registroVotos = new ConcurrentHashMap<>();

        // Inicializar todas las películas con 0 votos, en el caso de que no sea votada
        for (Pelicula p : peliculasCandidatas) {
            registroVotos.put(p.getTitulo(), 0);
        }

        // Instanciamos nuestro semáforo de solo 5 jurados votando simultáneamente
        Semaphore semaforo = new Semaphore(5);

        // Creamos una lista de resultados futuros, void porque no devuelve ningún valo, solo esperamos a qué termine
        List<CompletableFuture<Void>> resultadosFuturos = new ArrayList<>();

        // Aquí empezamos a lanzar los hilos, cada hilo es una votación aleatoria, lanzará tantos votos como los que hemos puesto en la URL
        for (int i = 0; i < numeroVotaciones; i++) {
            /* Aquí utilizamos self porque al llamar un método a otro que tiene @Async dentro de la misma clase no se activa el taskexecutor
                por lo tanto hacemos como una trampa inyectando el propio sevicio(para ahorrar tiempo), lo correcto es poner este método con
                la anotación en otra clase
             */
            resultadosFuturos.add(this.self.votarComoJurado(registroVotos, peliculasCandidatas, semaforo));
        }

        // Esperamos a que todos acaben, le pasamos la lista de resultados futuros como array[], el 0 en realidad se ajusta automáticametne al tamaño
        CompletableFuture.allOf(resultadosFuturos.toArray(new CompletableFuture[0])).join();

        long tiempoTotalVotacion = System.currentTimeMillis() - inicio;
        // Imprimimos el resultado final:
        System.out.println("Votación realizada en: " + tiempoTotalVotacion + " milisegundos");
        System.out.println("---- RECUENTO FINAL ----");
        /* Tras hacer las pruebas:
            - 10 votaciones: 0ms
            - 100 votaciones: 1ms
            - 100 votaciones: 3ms
         */

        // Ordenar por puntuación descendente, no modifica el registro de votos solo hace sout ordenado
        registroVotos.entrySet().stream()
                // Aquí compara todos con todos, sorted espera 2 elementos para comparar y en función del resultado de la resta lo coloca antes o después
                // Utilizamos - para ordenar como ranking, si pusiéramos + iría de menor a mayor
                .sorted((a, b) -> b.getValue() - a.getValue())
                // Aquí hacemos un forEach, imprimimos de manera sencilla primero con la clave y luego con el valor
                .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue() + " puntos"));

        // Devolvemos el hashmap,se muestra desordenado en el navegador porque spring al serializar desordena
        return new HashMap<>(registroVotos);
    }

    @Async("taskExecutor")
    // Método que devuelve un completable future
    public CompletableFuture<Void> votarComoJurado(
            ConcurrentHashMap<String, Integer> votos, // Le pasamos un mapa, pero es un tipo seguro para concurrencia, no un simple hashmap
            List<Pelicula> peliculas, // Le pasamos la lista de películas
            Semaphore semaforo) { // Le pasamos el semáforo

        try {
            // Solicitan el permiso al semáforo
            semaforo.acquire();

            // Elegimos la película de manera aleatoria, generar un número dentro del rango del tamaño del array
            Pelicula peliculaRandom = peliculas.get(new Random().nextInt(peliculas.size()));
            String titulo = peliculaRandom.getTitulo();

            // Voto aleatorio 0–10
            int puntoAleatorios = new Random().nextInt(11);

            /* Sumamos al mapa de forma segura
                el título es la clave a actualizar
                puntosAleatorios va a ser el valor en el caso de que la clave no exista
                y el método de referencia dice que si ya hay valores se suman, ya que se tienen que combinar si los valores ya existen
             */
            votos.merge(titulo, puntoAleatorios, Integer::sum); // El método de referencia es similar a (a, b) -> a + b

            // Ahora imprimimos la votación de cada jurado / hilo
            System.out.println("[" + Thread.currentThread().getName() + "] "
                    + "vota " + puntoAleatorios + " puntos a " + titulo);

            semaforo.release(); // liberamos el hueco en el semáforo, ya que ha acabado

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        // Retornamos que la tarea ha acabado
        return CompletableFuture.completedFuture(null);
    }
}
