package com.cine.util;

import com.cine.modelo.*;
import com.cine.repositorio.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final DirectorRepository directorRepository;
    private final ActorRepository actorRepository;
    private final PeliculaRepository peliculaRepository;
    private final SalaRepository salaRepository;
    private final FuncionRepository funcionRepository;
    private final ButacaRepository butacaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (rolRepository.count() > 0) return;
        System.out.println(">>> Verificando datos iniciales...");

        // =====================================================
        // ROLES Y USUARIOS
        // =====================================================
        Rol roleAdmin = rolRepository.save(Rol.builder().nombre("ADMIN").build());
        Rol roleUser  = rolRepository.save(Rol.builder().nombre("USER").build());

        usuarioRepository.save(Usuario.builder().email("admin@cine.com")
                .password(passwordEncoder.encode("admin")).nombre("Administrador")
                .enabled(true).roles(Set.of(roleAdmin)).build());
        usuarioRepository.save(Usuario.builder().email("user@cine.com")
                .password(passwordEncoder.encode("user")).nombre("Usuario Demo")
                .enabled(true).roles(Set.of(roleUser)).build());
        System.out.println(">>> Usuarios ADMIN y USER creados");

        // =====================================================
        // DIRECTORES
        // =====================================================
        Director nolan      = saveDir("Christopher Nolan");
        Director spielberg   = saveDir("Steven Spielberg");
        Director tarantino   = saveDir("Quentin Tarantino");
        Director villeneuve  = saveDir("Denis Villeneuve");
        Director scorsese    = saveDir("Martin Scorsese");
        Director fincher     = saveDir("David Fincher");
        Director bong        = saveDir("Bong Joon-ho");
        Director cameron     = saveDir("James Cameron");
        Director peele       = saveDir("Jordan Peele");
        Director wachowski   = saveDir("Lana Wachowski");
        Director russo       = saveDir("Anthony Russo");
        Director docter      = saveDir("Pete Docter");
        Director darabont    = saveDir("Frank Darabont");
        Director zemeckis    = saveDir("Robert Zemeckis");
        Director coogler     = saveDir("Ryan Coogler");

        // =====================================================
        // ACTORES
        // =====================================================
        Actor dicaprio    = saveAct("Leonardo DiCaprio");
        Actor hardy       = saveAct("Tom Hardy");
        Actor elliot      = saveAct("Elliot Page");
        Actor pitt        = saveAct("Brad Pitt");
        Actor robbie      = saveAct("Margot Robbie");
        Actor chalamet    = saveAct("Timothée Chalamet");
        Actor zendaya     = saveAct("Zendaya");
        Actor isaac       = saveAct("Oscar Isaac");
        Actor deniro      = saveAct("Robert De Niro");
        Actor pesci       = saveAct("Joe Pesci");
        Actor pacino      = saveAct("Al Pacino");
        Actor songkang    = saveAct("Song Kang-ho");
        Actor choiwoo     = saveAct("Choi Woo-shik");
        Actor norton      = saveAct("Edward Norton");
        Actor reeves      = saveAct("Keanu Reeves");
        Actor fishburne   = saveAct("Laurence Fishburne");
        Actor moss        = saveAct("Carrie-Anne Moss");
        Actor downey      = saveAct("Robert Downey Jr.");
        Actor evans       = saveAct("Chris Evans");
        Actor johansson   = saveAct("Scarlett Johansson");
        Actor hemsworth   = saveAct("Chris Hemsworth");
        Actor hanks       = saveAct("Tom Hanks");
        Actor robbins     = saveAct("Tim Robbins");
        Actor freeman     = saveAct("Morgan Freeman");
        Actor boseman     = saveAct("Chadwick Boseman");
        Actor kaluuya     = saveAct("Daniel Kaluuya");
        Actor worthington = saveAct("Sam Worthington");
        Actor saldana     = saveAct("Zoe Saldaña");
        Actor weaver      = saveAct("Sigourney Weaver");
        Actor waltz       = saveAct("Christoph Waltz");
        Actor jackson     = saveAct("Samuel L. Jackson");
        Actor foxx        = saveAct("Jamie Foxx");
        Actor murphy      = saveAct("Cillian Murphy");
        Actor hathaway    = saveAct("Anne Hathaway");
        Actor mcconaughey = saveAct("Matthew McConaughey");

        // =================================================================
        // PELÍCULA 1: Inception (2010)
        // =================================================================
        Pelicula inception = peliculaRepository.save(Pelicula.builder()
                .titulo("Inception")
                .duracion(148).edadMinima(13).genero("Ciencia Ficción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg")
                .sinopsis("Un ladrón que roba secretos corporativos a través del uso de tecnología de compartir sueños recibe la tarea inversa de implantar una idea en la mente de un CEO.")
                .director(nolan).actores(new HashSet<>(Arrays.asList(dicaprio, hardy, elliot, murphy)))
                .build());

        // =================================================================
        // PELÍCULA 2: Érase una vez en Hollywood (2019)
        // =================================================================
        Pelicula hollywood = peliculaRepository.save(Pelicula.builder()
                .titulo("Érase una vez en Hollywood")
                .duracion(161).edadMinima(16).genero("Drama")
                .imagenUrl("https://image.tmdb.org/t/p/w500/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg")
                .sinopsis("Una historia ambientada en Los Ángeles en 1969, en el apogeo del Hollywood hippy. Los dos protagonistas son Rick Dalton, antigua estrella de una serie de televisión del oeste, y Cliff Booth, su doble de acción desde hace años.")
                .director(tarantino).actores(new HashSet<>(Arrays.asList(dicaprio, pitt, robbie)))
                .build());

        // =================================================================
        // PELÍCULA 3: Dune (2021)
        // =================================================================
        Pelicula dune = peliculaRepository.save(Pelicula.builder()
                .titulo("Dune")
                .duracion(155).edadMinima(13).genero("Ciencia Ficción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg")
                .sinopsis("Paul Atreides, un joven brillante y talentoso nacido en un gran destino más allá de su comprensión, debe viajar al planeta más peligroso del universo para asegurar el futuro de su familia y su gente.")
                .director(villeneuve).actores(new HashSet<>(Arrays.asList(chalamet, zendaya, isaac)))
                .build());

        // =================================================================
        // PELÍCULA 4: El Irlandés (2019)
        // =================================================================
        Pelicula irlandes = peliculaRepository.save(Pelicula.builder()
                .titulo("El Irlandés")
                .duracion(209).edadMinima(16).genero("Drama")
                .imagenUrl("https://image.tmdb.org/t/p/w500/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg")
                .sinopsis("Un veterano de la Segunda Guerra Mundial, Frank Sheeran, un estafador y sicario, trabajó junto al sindicato de camioneros más importante del país. Frank recuerda los secretos que guardó como leal miembro de la familia criminal Bufalino.")
                .director(scorsese).actores(new HashSet<>(Arrays.asList(deniro, pacino, pesci)))
                .build());

        // =================================================================
        // PELÍCULA 5: Parásitos (2019)
        // =================================================================
        Pelicula parasitos = peliculaRepository.save(Pelicula.builder()
                .titulo("Parásitos")
                .duracion(132).edadMinima(16).genero("Thriller")
                .imagenUrl("https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg")
                .sinopsis("Toda la familia de Ki-taek está sin trabajo. Cuando su hijo mayor, Ki-woo, empieza a dar clases particulares en casa de los Park, las dos familias, muy distintas entre sí, comienzan una interrelación de resultados impredecibles.")
                .director(bong).actores(new HashSet<>(Arrays.asList(songkang, choiwoo)))
                .build());

        // =================================================================
        // PELÍCULA 6: El club de la pelea (1999)
        // =================================================================
        Pelicula fightclub = peliculaRepository.save(Pelicula.builder()
                .titulo("El club de la pelea")
                .duracion(139).edadMinima(18).genero("Thriller")
                .imagenUrl("https://image.tmdb.org/t/p/w500/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg")
                .sinopsis("Un joven insomne busca algo que dé sentido a su vida. Lo encuentra en un carismático vendedor de jabón que tiene una filosofía muy particular.")
                .director(fincher).actores(new HashSet<>(Arrays.asList(pitt, norton)))
                .build());

        // =================================================================
        // PELÍCULA 7: Matrix (1999)
        // =================================================================
        Pelicula matrix = peliculaRepository.save(Pelicula.builder()
                .titulo("Matrix")
                .duracion(136).edadMinima(13).genero("Ciencia Ficción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg")
                .sinopsis("Thomas Anderson lleva una doble vida: por el día es programador en una importante empresa de software, y por la noche un hacker conocido como Neo. Su vida cambia cuando es contactado por Morfeo.")
                .director(wachowski).actores(new HashSet<>(Arrays.asList(reeves, fishburne, moss)))
                .build());

        // =================================================================
        // PELÍCULA 8: Avengers: Endgame (2019)
        // =================================================================
        Pelicula endgame = peliculaRepository.save(Pelicula.builder()
                .titulo("Avengers: Endgame")
                .duracion(181).edadMinima(13).genero("Acción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg")
                .sinopsis("Después de los devastadores eventos de Avengers: Infinity War, el universo está en ruinas. Con la ayuda de los aliados restantes, los Vengadores se reúnen una vez más para revertir las acciones de Thanos y restaurar el orden en el universo.")
                .director(russo).actores(new HashSet<>(Arrays.asList(downey, evans, johansson, hemsworth)))
                .build());

        // =================================================================
        // PELÍCULA 9: Interestelar (2014)
        // =================================================================
        Pelicula interstellar = peliculaRepository.save(Pelicula.builder()
                .titulo("Interestelar")
                .duracion(169).edadMinima(7).genero("Ciencia Ficción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg")
                .sinopsis("Un grupo de exploradores hace uso de un agujero de gusano recientemente descubierto para superar las limitaciones de los viajes espaciales humanos y conquistar las vastas distancias involucradas en un viaje interestelar.")
                .director(nolan).actores(new HashSet<>(Arrays.asList(mcconaughey, hathaway)))
                .build());

        // =================================================================
        // PELÍCULA 10: Cadena Perpetua (1994)
        // =================================================================
        Pelicula shawshank = peliculaRepository.save(Pelicula.builder()
                .titulo("Cadena Perpetua")
                .duracion(142).edadMinima(16).genero("Drama")
                .imagenUrl("https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg")
                .sinopsis("Andy Dufresne es un joven y exitoso banquero cuya vida cambia drásticamente cuando es condenado por un crimen que no cometió: el asesinato de su esposa y su amante.")
                .director(darabont).actores(new HashSet<>(Arrays.asList(robbins, freeman)))
                .build());

        // =================================================================
        // PELÍCULA 11: Forrest Gump (1994)
        // =================================================================
        Pelicula forrest = peliculaRepository.save(Pelicula.builder()
                .titulo("Forrest Gump")
                .duracion(142).edadMinima(7).genero("Drama")
                .imagenUrl("https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg")
                .sinopsis("Forrest Gump, un hombre con un coeficiente intelectual bajo pero con un gran corazón, cuenta su vida mientras espera en una banca de bus. Sin saberlo, ha sido partícipe de los eventos más importantes de la historia reciente de Estados Unidos.")
                .director(zemeckis).actores(new HashSet<>(Arrays.asList(hanks)))
                .build());

        // =================================================================
        // PELÍCULA 12: Black Panther (2018)
        // =================================================================
        Pelicula blackpanther = peliculaRepository.save(Pelicula.builder()
                .titulo("Black Panther")
                .duracion(134).edadMinima(13).genero("Acción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg")
                .sinopsis("T'Challa regresa a casa, la aislada pero tecnológicamente avanzada nación africana de Wakanda, para convertirse en rey después de la muerte de su padre. Pero cuando un viejo enemigo reaparece, el temple de T'Challa como rey, y como Black Panther, se pone a prueba.")
                .director(coogler).actores(new HashSet<>(Arrays.asList(boseman)))
                .build());

        // =================================================================
        // PELÍCULA 13: ¡Huye! (Get Out) (2017)
        // =================================================================
        Pelicula getout = peliculaRepository.save(Pelicula.builder()
                .titulo("¡Huye!")
                .duracion(104).edadMinima(16).genero("Terror")
                .imagenUrl("https://image.tmdb.org/t/p/w500/mE24wUCfjK8AoBBjaMjho7Rczr7.jpg")
                .sinopsis("Chris, un joven afroamericano, descubre un preocupante secreto cuando conoce a la familia de su novia caucásica durante un fin de semana.")
                .director(peele).actores(new HashSet<>(Arrays.asList(kaluuya)))
                .build());

        // =================================================================
        // PELÍCULA 14: Avatar (2009)
        // =================================================================
        Pelicula avatar = peliculaRepository.save(Pelicula.builder()
                .titulo("Avatar")
                .duracion(162).edadMinima(7).genero("Ciencia Ficción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg")
                .sinopsis("En el exuberante mundo alienígena de Pandora viven los Na'vi, seres que parecen ser primitivos pero que son más evolucionados que los humanos. Jake Sully, un ex-marine inválido, se encuentra dividido entre dos mundos.")
                .director(cameron).actores(new HashSet<>(Arrays.asList(worthington, saldana, weaver)))
                .build());

        // =================================================================
        // PELÍCULA 15: Django Desencadenado (2012)
        // =================================================================
        Pelicula django = peliculaRepository.save(Pelicula.builder()
                .titulo("Django Desencadenado")
                .duracion(165).edadMinima(18).genero("Acción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg")
                .sinopsis("Un esclavo liberado se une a un cazarrecompensas alemán para rescatar a su esposa de un terrateniente cruel en el sur de Estados Unidos antes de la Guerra Civil.")
                .director(tarantino).actores(new HashSet<>(Arrays.asList(foxx, waltz, dicaprio, jackson)))
                .build());

        // =================================================================
        // PELÍCULA 16: El caballero de la noche (2008)
        // =================================================================
        Pelicula darkknight = peliculaRepository.save(Pelicula.builder()
                .titulo("El caballero de la noche")
                .duracion(152).edadMinima(13).genero("Acción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg")
                .sinopsis("Batman, Gordon y Harvey Dent aúnan fuerzas para acabar con el crimen organizado en Gotham, pero un villano llamado el Joker desata el caos y acaba con el orden en la ciudad.")
                .director(nolan).actores(new HashSet<>(Arrays.asList(murphy)))
                .build());

        // =================================================================
        // PELÍCULA 17: Pulp Fiction (1994)
        // =================================================================
        Pelicula pulp = peliculaRepository.save(Pelicula.builder()
                .titulo("Pulp Fiction")
                .duracion(154).edadMinima(18).genero("Crimen")
                .imagenUrl("https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg")
                .sinopsis("Las vidas de dos mafiosos, un boxeador, la esposa de un gángster y dos bandidos se entrelazan en cuatro historias de violencia y redención.")
                .director(tarantino).actores(new HashSet<>(Arrays.asList(jackson)))
                .build());

        // =================================================================
        // PELÍCULA 18: La lista de Schindler (1993)
        // =================================================================
        Pelicula schindler = peliculaRepository.save(Pelicula.builder()
                .titulo("La lista de Schindler")
                .duracion(195).edadMinima(16).genero("Drama")
                .imagenUrl("https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg")
                .sinopsis("La historia de Oskar Schindler, un empresario alemán que salvó la vida de más de mil judíos durante el Holocausto al emplearlos en sus fábricas.")
                .director(spielberg)
                .build());

        // =================================================================
        // PELÍCULA 19: Up (2009)
        // =================================================================
        Pelicula up = peliculaRepository.save(Pelicula.builder()
                .titulo("Up")
                .duracion(96).edadMinima(0).genero("Animación")
                .imagenUrl("https://image.tmdb.org/t/p/w500/xwvJ3WzdJ1OCuDoY8LAxBUlQyig.jpg")
                .sinopsis("Carl Fredricksen, un viudo de 78 años, viaja a Sudamérica en su casa flotante sostenida por miles de globos. Sin quererlo, lleva consigo a Russell, un explorador de 8 años.")
                .director(docter)
                .build());

        // =================================================================
        // PELÍCULA 20: Blade Runner 2049 (2017)
        // =================================================================
        Pelicula bladerunner = peliculaRepository.save(Pelicula.builder()
                .titulo("Blade Runner 2049")
                .duracion(164).edadMinima(16).genero("Ciencia Ficción")
                .imagenUrl("https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg")
                .sinopsis("El oficial K de la LAPD, un nuevo blade runner, descubre un secreto largamente oculto que podría hundir lo que queda de la sociedad en el caos y le lleva a buscar a Rick Deckard, un antiguo blade runner desaparecido hace 30 años.")
                .director(villeneuve).actores(new HashSet<>(Arrays.asList(hardy)))
                .build());

        System.out.println(">>> 20 PELÍCULAS cargadas con sus directores y actores");

        // =================================================================
        // 8 SALAS CON BUTACAS GENERADAS AUTOMÁTICAMENTE
        // =================================================================
        Sala sala1 = crearSalaConButacas("Sala IMAX 1",        TipoSala.IMAX,     12, 18);
        Sala sala2 = crearSalaConButacas("Sala VIP Gold",       TipoSala.VIP,       6, 10);
        Sala sala3 = crearSalaConButacas("Sala 4DX Experience", TipoSala.FOUR_DX,   8, 12);
        Sala sala4 = crearSalaConButacas("Sala 1",              TipoSala.STANDARD, 10, 16);
        Sala sala5 = crearSalaConButacas("Sala 2",              TipoSala.STANDARD, 10, 16);
        Sala sala6 = crearSalaConButacas("Sala 3",              TipoSala.STANDARD, 10, 14);
        Sala sala7 = crearSalaConButacas("Sala Infantil",       TipoSala.STANDARD,  6, 12);
        Sala sala8 = crearSalaConButacas("Sala Premium Dolby",  TipoSala.VIP,       8, 14);
        System.out.println(">>> 8 SALAS creadas con butacas generadas");

        // =================================================================
        // FUNCIONES — Generadas dinámicamente a partir de hoy
        // =================================================================
        List<Pelicula> peliculas = List.of(inception, hollywood, dune, irlandes, parasitos,
                fightclub, matrix, endgame, interstellar, shawshank, forrest, blackpanther,
                getout, avatar, django, darkknight, pulp, schindler, up, bladerunner);

        Sala[] salas   = {sala1, sala2, sala3, sala4, sala5, sala6, sala7, sala8};
        double[] precios = {10.50, 14.00, 12.50, 8.50, 8.50, 8.50, 7.00, 14.00};
        int[][] horarios = {{16,0},{18,30},{20,0},{22,15}};

        LocalDateTime hoy = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);

        int count = 0;
        for (int i = 0; i < peliculas.size(); i++) {
            Pelicula peli = peliculas.get(i);
            Sala salaA = salas[i % salas.length];
            Sala salaB = salas[(i + 3) % salas.length];
            int diaOffset = i % 7;
            LocalDateTime base = hoy.plusDays(diaOffset);

            int[] h1 = horarios[i % horarios.length];
            funcionRepository.save(Funcion.builder().pelicula(peli).sala(salaA)
                    .fechaHora(base.withHour(h1[0]).withMinute(h1[1]))
                    .precio(precios[i % precios.length]).build());
            count++;

            int[] h2 = horarios[(i + 1) % horarios.length];
            funcionRepository.save(Funcion.builder().pelicula(peli).sala(salaB)
                    .fechaHora(base.plusDays(1).withHour(h2[0]).withMinute(h2[1]))
                    .precio(precios[(i + 3) % precios.length]).build());
            count++;
        }
        System.out.println(">>> " + count + " FUNCIONES creadas a partir de " + hoy.toLocalDate());
        System.out.println(">>> Datos iniciales cargados correctamente!");
    }

    // =================================================================
    // MÉTODOS HELPER
    // =================================================================

    private Director saveDir(String nombre) {
        return directorRepository.save(Director.builder().nombre(nombre).build());
    }

    private Actor saveAct(String nombre) {
        return actorRepository.save(Actor.builder().nombre(nombre).build());
    }

    private Sala crearSalaConButacas(String nombre, TipoSala tipo, int filas, int asientosPorFila) {
        Sala sala = salaRepository.save(Sala.builder()
                .nombre(nombre).tipo(tipo).filas(filas).asientosPorFila(asientosPorFila)
                .capacidad(filas * asientosPorFila).build());

        List<Butaca> butacas = new ArrayList<>();
        for (int f = 0; f < filas; f++) {
            String letraFila = String.valueOf((char) ('A' + f));
            for (int a = 1; a <= asientosPorFila; a++) {
                TipoButaca tipoButaca;
                if (f == filas - 1 && a == 1) {
                    tipoButaca = TipoButaca.ACCESIBLE;
                } else if (tipo == TipoSala.VIP) {
                    tipoButaca = TipoButaca.VIP;
                } else {
                    tipoButaca = TipoButaca.NORMAL;
                }
                butacas.add(Butaca.builder()
                        .fila(letraFila).numero(a).tipo(tipoButaca).sala(sala).build());
            }
        }
        butacaRepository.saveAll(butacas);
        return sala;
    }
}
