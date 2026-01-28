package gestionPeliculas.service;

import gestionPeliculas.domain.*;
import gestionPeliculas.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

/**
 * Servicio para generar datos aleatorios al crear películas:
 * - Plataformas de streaming (1-3)
 * - Idiomas (español + inglés siempre, posiblemente alemán/francés)
 * - Críticas automáticas (1-3)
 */
@Service
public class RandomDataGeneratorService {

    @Autowired
    private PlataformaRepository plataformaRepository;

    @Autowired
    private IdiomaRepository idiomaRepository;

    @Autowired
    private CriticaRepository criticaRepository;

    private final Random random = new Random();

    // Plataformas disponibles
    private static final String[] PLATAFORMAS = {
            "Netflix", "Amazon Prime Video", "Disney+", "HBO Max"
    };

    // Idiomas base (siempre incluidos) y adicionales
    private static final String[] IDIOMAS_BASE = { "Español", "Inglés" };
    private static final String[] IDIOMAS_EXTRA = { "Alemán", "Francés" };

    // Plantillas de críticas automáticas
    private static final String[] CRITICA_TEMPLATES = {
            "%s ha creado una obra maestra cinematográfica.",
            "Una película que demuestra el talento de %s como director.",
            "El trabajo de %s en esta película es excepcional.",
            "Una historia cautivadora dirigida magistralmente por %s.",
            "%s nos sorprende una vez más con su visión única.",
            "Una producción impecable que muestra la experiencia de %s.",
            "El director %s consigue emocionar al espectador de principio a fin.",
            "Una película imprescindible en la filmografía de %s.",
            "%s demuestra su dominio del género con esta entrega.",
            "El sello distintivo de %s brilla en cada escena."
    };

    // Autores ficticios para las críticas
    private static final String[] AUTORES_CRITICA = {
            "CineReview", "FilmCritic", "MovieExpert", "CinéfilosPro",
            "ReviewMaster", "CinemaWorld", "FilmAdvisor", "PeliculasOnline",
            "CineFanático", "CríticoDigital"
    };

    /**
     * Genera y asigna plataformas aleatorias a una película
     */
    public List<Plataforma> generarPlataformasAleatorias() {
        List<Plataforma> plataformas = new ArrayList<>();
        int numPlataformas = random.nextInt(3) + 1; // 1-3 plataformas

        List<String> plataformasDisponibles = new ArrayList<>(Arrays.asList(PLATAFORMAS));
        Collections.shuffle(plataformasDisponibles);

        for (int i = 0; i < numPlataformas && i < plataformasDisponibles.size(); i++) {
            String nombre = plataformasDisponibles.get(i);
            Plataforma p = plataformaRepository.findByNombre(nombre)
                    .orElseGet(() -> {
                        Plataforma nueva = new Plataforma();
                        nueva.setNombre(nombre);
                        nueva.setUrl(getPlataformaUrl(nombre));
                        return plataformaRepository.save(nueva);
                    });
            plataformas.add(p);
        }

        return plataformas;
    }

    /**
     * Genera y asigna idiomas aleatorios a una película
     * Siempre incluye Español e Inglés, y posiblemente Alemán o Francés
     */
    public List<Idioma> generarIdiomasAleatorios() {
        List<Idioma> idiomas = new ArrayList<>();

        // Añadir idiomas base (Español e Inglés siempre)
        for (String nombre : IDIOMAS_BASE) {
            Idioma i = idiomaRepository.findByNombre(nombre)
                    .orElseGet(() -> {
                        Idioma nuevo = new Idioma();
                        nuevo.setNombre(nombre);
                        return idiomaRepository.save(nuevo);
                    });
            idiomas.add(i);
        }

        // Posibilidad de añadir idiomas extra (50% cada uno)
        for (String nombre : IDIOMAS_EXTRA) {
            if (random.nextBoolean()) {
                Idioma i = idiomaRepository.findByNombre(nombre)
                        .orElseGet(() -> {
                            Idioma nuevo = new Idioma();
                            nuevo.setNombre(nombre);
                            return idiomaRepository.save(nuevo);
                        });
                idiomas.add(i);
            }
        }

        return idiomas;
    }

    /**
     * Genera críticas automáticas para una película
     */
    public void generarCriticasAleatorias(Pelicula pelicula) {
        int numCriticas = random.nextInt(3) + 1; // 1-3 críticas
        String directorNombre = pelicula.getDirector() != null
                ? pelicula.getDirector().getNombre()
                : "el equipo de dirección";

        List<String> autoresUsados = new ArrayList<>();
        List<String> templatesUsados = new ArrayList<>();

        for (int i = 0; i < numCriticas; i++) {
            Critica critica = new Critica();

            // Seleccionar template no repetido
            String template;
            do {
                template = CRITICA_TEMPLATES[random.nextInt(CRITICA_TEMPLATES.length)];
            } while (templatesUsados.contains(template) && templatesUsados.size() < CRITICA_TEMPLATES.length);
            templatesUsados.add(template);

            // Generar comentario con el nombre del director
            critica.setComentario(String.format(template, directorNombre));

            // Nota aleatoria entre 7.0 y 10.0 (críticas positivas)
            critica.setNota(7.0 + random.nextDouble() * 3.0);

            // Fecha reciente (últimos 30 días)
            critica.setFecha(LocalDate.now().minusDays(random.nextInt(30)));

            // Autor aleatorio no repetido
            String autor;
            do {
                autor = AUTORES_CRITICA[random.nextInt(AUTORES_CRITICA.length)];
            } while (autoresUsados.contains(autor) && autoresUsados.size() < AUTORES_CRITICA.length);
            autoresUsados.add(autor);
            critica.setAutor(autor);

            // Asociar a la película
            critica.setPelicula(pelicula);

            criticaRepository.save(critica);
        }
    }

    /**
     * Obtiene la URL de una plataforma de streaming
     */
    private String getPlataformaUrl(String nombre) {
        return switch (nombre) {
            case "Netflix" -> "https://www.netflix.com";
            case "Amazon Prime Video" -> "https://www.primevideo.com";
            case "Disney+" -> "https://www.disneyplus.com";
            case "HBO Max" -> "https://www.hbomax.com";
            default -> "https://www.google.com/search?q=" + nombre;
        };
    }
}
