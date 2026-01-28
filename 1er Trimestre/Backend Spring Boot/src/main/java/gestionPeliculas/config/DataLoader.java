package gestionPeliculas.config;

import gestionPeliculas.domain.*;
import gestionPeliculas.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.*;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(
            UsuarioRepository usuarioRepo,
            PlataformaRepository plataformaRepo,
            SalaRepository salaRepo,
            PeliculaRepository peliculaRepo,
            DirectorRepository directorRepo,
            ActorRepository actorRepo,
            CategoriaRepository categoriaRepo,
            IdiomaRepository idiomaRepo) {

        return args -> {
            System.out.println(">>> Verificando datos iniciales...");

            // =====================================================
            // USUARIOS (se mantiene igual)
            // =====================================================
            if (usuarioRepo.findByUsername("admin") == null) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setEmail("admin@admin.com");
                admin.setPassword("admin123");
                admin.setAdmin(true);
                usuarioRepo.save(admin);
                System.out.println(">>> Usuario ADMIN creado");
            } else {
                System.out.println(">>> Usuario ADMIN ya existe");
            }

            if (usuarioRepo.findByUsername("usuario") == null) {
                Usuario usuario = new Usuario();
                usuario.setUsername("usuario");
                usuario.setEmail("usuario@usuario.com");
                usuario.setPassword("usuario");
                usuario.setAdmin(false);
                usuarioRepo.save(usuario);
                System.out.println(">>> Usuario NORMAL creado");
            } else {
                System.out.println(">>> Usuario NORMAL ya existe");
            }

            // =====================================================
            // PLATAFORMAS (se mantiene igual)
            // =====================================================
            Plataforma netflix = plataformaRepo.findByNombre("Netflix").orElseGet(() -> {
                Plataforma p = new Plataforma();
                p.setNombre("Netflix");
                p.setUrl("https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg");
                System.out.println(">>> Plataforma NETFLIX creada");
                return plataformaRepo.save(p);
            });

            Plataforma disney = plataformaRepo.findByNombre("Disney+").orElseGet(() -> {
                Plataforma p = new Plataforma();
                p.setNombre("Disney+");
                p.setUrl("https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg");
                System.out.println(">>> Plataforma DISNEY+ creada");
                return plataformaRepo.save(p);
            });

            Plataforma hbo = plataformaRepo.findByNombre("HBO Max").orElseGet(() -> {
                Plataforma p = new Plataforma();
                p.setNombre("HBO Max");
                p.setUrl("https://image.tmdb.org/t/p/original/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg");
                System.out.println(">>> Plataforma HBO MAX creada");
                return plataformaRepo.save(p);
            });

            Plataforma prime = plataformaRepo.findByNombre("Prime Video").orElseGet(() -> {
                Plataforma p = new Plataforma();
                p.setNombre("Prime Video");
                p.setUrl("https://image.tmdb.org/t/p/original/emthp39XA2YScoYL1p0sdbAH2WA.jpg");
                System.out.println(">>> Plataforma PRIME VIDEO creada");
                return plataformaRepo.save(p);
            });

            // =====================================================
            // SALAS (se mantiene igual)
            // =====================================================
            if (salaRepo.count() == 0) {
                Sala sala1 = new Sala();
                sala1.setNumeroSala(1L);
                sala1.setCapacidad(100L);
                salaRepo.save(sala1);

                Sala sala2 = new Sala();
                sala2.setNumeroSala(2L);
                sala2.setCapacidad(150L);
                salaRepo.save(sala2);

                Sala sala3 = new Sala();
                sala3.setNumeroSala(3L);
                sala3.setCapacidad(200L);
                salaRepo.save(sala3);
                System.out.println(">>> 3 SALAS creadas por defecto");
            } else {
                System.out.println(">>> SALAS ya existentes");
            }

            // =====================================================
            // PELÍCULAS, DIRECTORES, ACTORES (solo si no hay películas)
            // =====================================================
            if (peliculaRepo.count() == 0) {
                System.out.println(">>> Cargando películas, directores y actores...");

                // --- CATEGORÍAS ---
                Categoria accion = getOrCreateCategoria(categoriaRepo, "Acción");
                Categoria drama = getOrCreateCategoria(categoriaRepo, "Drama");
                Categoria scifi = getOrCreateCategoria(categoriaRepo, "Ciencia Ficción");
                Categoria comedia = getOrCreateCategoria(categoriaRepo, "Comedia");
                Categoria thriller = getOrCreateCategoria(categoriaRepo, "Thriller");
                Categoria fantasia = getOrCreateCategoria(categoriaRepo, "Fantasía");
                Categoria animacion = getOrCreateCategoria(categoriaRepo, "Animación");
                Categoria aventura = getOrCreateCategoria(categoriaRepo, "Aventura");
                Categoria terror = getOrCreateCategoria(categoriaRepo, "Terror");
                Categoria romance = getOrCreateCategoria(categoriaRepo, "Romance");
                Categoria crimen = getOrCreateCategoria(categoriaRepo, "Crimen");

                // --- IDIOMAS ---
                Idioma espanol = getOrCreateIdioma(idiomaRepo, "Español");
                Idioma ingles = getOrCreateIdioma(idiomaRepo, "Inglés");
                Idioma frances = getOrCreateIdioma(idiomaRepo, "Francés");
                Idioma japones = getOrCreateIdioma(idiomaRepo, "Japonés");
                Idioma coreano = getOrCreateIdioma(idiomaRepo, "Coreano");

                // --- DIRECTORES ---
                Director nolan = getOrCreateDirector(directorRepo, "Christopher", "Nolan",
                        "https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg");
                Director spielberg = getOrCreateDirector(directorRepo, "Steven", "Spielberg",
                        "https://image.tmdb.org/t/p/w500/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg");
                Director tarantino = getOrCreateDirector(directorRepo, "Quentin", "Tarantino",
                        "https://image.tmdb.org/t/p/w500/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg");
                Director villeneuve = getOrCreateDirector(directorRepo, "Denis", "Villeneuve",
                        "https://image.tmdb.org/t/p/w500/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg");
                Director scorsese = getOrCreateDirector(directorRepo, "Martin", "Scorsese",
                        "https://image.tmdb.org/t/p/w500/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg");
                Director fincher = getOrCreateDirector(directorRepo, "David", "Fincher",
                        "https://image.tmdb.org/t/p/w500/wdBeQXDNbbjkIKXHeEZtQShwSDM.jpg");
                Director bong = getOrCreateDirector(directorRepo, "Bong", "Joon-ho",
                        "https://image.tmdb.org/t/p/w500/t0v2wzZ5klfFWTzqMvunuBz3C1M.jpg");
                Director cameron = getOrCreateDirector(directorRepo, "James", "Cameron",
                        "https://image.tmdb.org/t/p/w500/9NAZnTjBQ9WcXAQEzZpKy4vdQto.jpg");
                Director peele = getOrCreateDirector(directorRepo, "Jordan", "Peele",
                        "https://image.tmdb.org/t/p/w500/kFUKn5g3ebPwqWwxnBGqe8MjSQB.jpg");
                Director wachowski = getOrCreateDirector(directorRepo, "Lana", "Wachowski",
                        "https://image.tmdb.org/t/p/w500/lGFzGwJeRfO49V0JlPgSPULkc07.jpg");
                Director russo = getOrCreateDirector(directorRepo, "Anthony", "Russo",
                        "https://image.tmdb.org/t/p/w500/5cj4xfkVJDzpHJCfjpdmMaUJuRh.jpg");
                Director pixar = getOrCreateDirector(directorRepo, "Pete", "Docter",
                        "https://image.tmdb.org/t/p/w500/xz46mHzo8apkVMxmrkMQvqakOr6.jpg");
                Director darabont = getOrCreateDirector(directorRepo, "Frank", "Darabont",
                        "https://image.tmdb.org/t/p/w500/7LqmE3p1XTwCdNCOmBxovq210Qk.jpg");
                Director zemeckis = getOrCreateDirector(directorRepo, "Robert", "Zemeckis",
                        "https://image.tmdb.org/t/p/w500/isCuZ9PWIOyXzdf3ihodXzjIumL.jpg");
                Director coogler = getOrCreateDirector(directorRepo, "Ryan", "Coogler",
                        "https://image.tmdb.org/t/p/w500/khSaNFNkIyWghhnWJYqLdILHIO4.jpg");

                // --- ACTORES ---
                Actor dicaprio = getOrCreateActor(actorRepo, "Leonardo", "DiCaprio",
                        "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg");
                Actor hardy = getOrCreateActor(actorRepo, "Tom", "Hardy",
                        "https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg");
                Actor elliot = getOrCreateActor(actorRepo, "Elliot", "Page",
                        "https://image.tmdb.org/t/p/w500/pWHf4khOloNVfCxscsXFj3jj6gP.jpg");
                Actor pitt = getOrCreateActor(actorRepo, "Brad", "Pitt",
                        "https://image.tmdb.org/t/p/w500/oTB9vGIBFWzp5S0eBMxB3NNjwZE.jpg");
                Actor robbie = getOrCreateActor(actorRepo, "Margot", "Robbie",
                        "https://image.tmdb.org/t/p/w500/euDPyqLnuwaWMHajcU3oZ9uZezR.jpg");
                Actor chalamet = getOrCreateActor(actorRepo, "Timothée", "Chalamet",
                        "https://image.tmdb.org/t/p/w500/BE2sdjpgsa2rNTFa66f7upkaOP.jpg");
                Actor zendaya = getOrCreateActor(actorRepo, "Zendaya", "",
                        "https://image.tmdb.org/t/p/w500/r3A7ev7QkjOGocVn3kQrJ0eOouk.jpg");
                Actor isaac = getOrCreateActor(actorRepo, "Oscar", "Isaac",
                        "https://image.tmdb.org/t/p/w500/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg");
                Actor deniro = getOrCreateActor(actorRepo, "Robert", "De Niro",
                        "https://image.tmdb.org/t/p/w500/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg");
                Actor pesci = getOrCreateActor(actorRepo, "Joe", "Pesci",
                        "https://image.tmdb.org/t/p/w500/3uxQMIf3TgPL1F9TThf28zVuJu0.jpg");
                Actor pacino = getOrCreateActor(actorRepo, "Al", "Pacino",
                        "https://image.tmdb.org/t/p/w500/2dGBb1fOcNdZjtQToVPFxXjm4ke.jpg");
                Actor songkang = getOrCreateActor(actorRepo, "Song", "Kang-ho",
                        "https://image.tmdb.org/t/p/w500/eXwMCiPbqLBV8kbErhbUJM0sNKC.jpg");
                Actor choiwoo = getOrCreateActor(actorRepo, "Choi", "Woo-shik",
                        "https://image.tmdb.org/t/p/w500/k89L3cQvrnbZ9E32VbTMWYtqXKR.jpg");
                Actor norton = getOrCreateActor(actorRepo, "Edward", "Norton",
                        "https://image.tmdb.org/t/p/w500/5XBzD5WuTyVQZeS4II6gs1nn5P6.jpg");
                Actor reeves = getOrCreateActor(actorRepo, "Keanu", "Reeves",
                        "https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg");
                Actor fishburne = getOrCreateActor(actorRepo, "Laurence", "Fishburne",
                        "https://image.tmdb.org/t/p/w500/7XP1bCr91XyDvp2WJUQEmvVOoqz.jpg");
                Actor moss = getOrCreateActor(actorRepo, "Carrie-Anne", "Moss",
                        "https://image.tmdb.org/t/p/w500/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg");
                Actor downey = getOrCreateActor(actorRepo, "Robert", "Downey Jr.",
                        "https://image.tmdb.org/t/p/w500/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg");
                Actor evans = getOrCreateActor(actorRepo, "Chris", "Evans",
                        "https://image.tmdb.org/t/p/w500/3bOGNsHlrswhyW79uvIHH1V43JI.jpg");
                Actor johansson = getOrCreateActor(actorRepo, "Scarlett", "Johansson",
                        "https://image.tmdb.org/t/p/w500/3JTEc2tGXPoMTWyCViB8sbf9x0E.jpg");
                Actor hemsworth = getOrCreateActor(actorRepo, "Chris", "Hemsworth",
                        "https://image.tmdb.org/t/p/w500/piQEn3HxQkWEkCjnPqNLiNb1DOX.jpg");
                Actor hanks = getOrCreateActor(actorRepo, "Tom", "Hanks",
                        "https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg");
                Actor robbins = getOrCreateActor(actorRepo, "Tim", "Robbins",
                        "https://image.tmdb.org/t/p/w500/A4fHNLX72RVqFCxkGMZ7D2UXOBS.jpg");
                Actor freeman = getOrCreateActor(actorRepo, "Morgan", "Freeman",
                        "https://image.tmdb.org/t/p/w500/jPsLqiYGSofU4s6BjrxnefMfabb.jpg");
                Actor boseman = getOrCreateActor(actorRepo, "Chadwick", "Boseman",
                        "https://image.tmdb.org/t/p/w500/mXDp2vIxN6CdF8vn2l7WxhbW4qP.jpg");
                Actor kaluuya = getOrCreateActor(actorRepo, "Daniel", "Kaluuya",
                        "https://image.tmdb.org/t/p/w500/aFtTPFKtcBCjxl5rbVG4xUKj4fT.jpg");
                Actor worthington = getOrCreateActor(actorRepo, "Sam", "Worthington",
                        "https://image.tmdb.org/t/p/w500/mflBcox36s9ZPbsZPVHeAC4k93.jpg");
                Actor saldana = getOrCreateActor(actorRepo, "Zoe", "Saldaña",
                        "https://image.tmdb.org/t/p/w500/iOVbUH20il632nj2v01NCtYYeSg.jpg");
                Actor weaver = getOrCreateActor(actorRepo, "Sigourney", "Weaver",
                        "https://image.tmdb.org/t/p/w500/flfhep27iBxseZIlxOMHt6zJFX1.jpg");
                Actor waltz = getOrCreateActor(actorRepo, "Christoph", "Waltz",
                        "https://image.tmdb.org/t/p/w500/rlhVl0gZjQN2fJKcdl7qjKABBRR.jpg");
                Actor jackson = getOrCreateActor(actorRepo, "Samuel L.", "Jackson",
                        "https://image.tmdb.org/t/p/w500/nCJJ3NVksYNxIzEHcyC1XziwPVj.jpg");
                Actor foxx = getOrCreateActor(actorRepo, "Jamie", "Foxx",
                        "https://image.tmdb.org/t/p/w500/hPwcME7kCpEjKHBNdYDNhpWTyxD.jpg");
                Actor murphy = getOrCreateActor(actorRepo, "Cillian", "Murphy",
                        "https://image.tmdb.org/t/p/w500/dm6V24NjjvjMiCtbMkc8Y2GO7Q7.jpg");
                Actor hathaway = getOrCreateActor(actorRepo, "Anne", "Hathaway",
                        "https://image.tmdb.org/t/p/w500/tLelKoPNiyJCSEtQTz1FGv4TLGc.jpg");
                Actor mcconaughey = getOrCreateActor(actorRepo, "Matthew", "McConaughey",
                        "https://image.tmdb.org/t/p/w500/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg");

                // =================================================================
                // PELÍCULA 1: Inception (2010)
                // =================================================================
                Pelicula inception = new Pelicula();
                inception.setTitulo("Inception");
                inception.setDuracion(148);
                inception.setFechaEstreno(LocalDate.of(2010, 7, 16));
                inception.setPosterUrl("https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg");
                inception.setSinopsis(
                        "Un ladrón que roba secretos corporativos a través del uso de tecnología de compartir sueños recibe la tarea inversa de implantar una idea en la mente de un CEO.");
                inception.setValoracion(9);
                inception.setDirector(nolan);
                inception.getActores().addAll(Arrays.asList(dicaprio, hardy, elliot, murphy));
                inception.getCategorias().addAll(Arrays.asList(scifi, accion, thriller));
                inception.getIdiomas().addAll(Arrays.asList(ingles, espanol));
                inception.getPlataformas().add(netflix);
                peliculaRepo.save(inception);

                // =================================================================
                // PELÍCULA 2: Érase una vez en Hollywood (2019)
                // =================================================================
                Pelicula hollywood = new Pelicula();
                hollywood.setTitulo("Érase una vez en Hollywood");
                hollywood.setDuracion(161);
                hollywood.setFechaEstreno(LocalDate.of(2019, 7, 26));
                hollywood.setPosterUrl("https://image.tmdb.org/t/p/w500/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg");
                hollywood.setSinopsis(
                        "Una historia ambientada en Los Ángeles en 1969, en el apogeo del Hollywood hippy. Los dos protagonistas son Rick Dalton, antigua estrella de una serie de televisión del oeste, y Cliff Booth, su doble de acción desde hace años.");
                hollywood.setValoracion(8);
                hollywood.setDirector(tarantino);
                hollywood.getActores().addAll(Arrays.asList(dicaprio, pitt, robbie));
                hollywood.getCategorias().addAll(Arrays.asList(drama, comedia));
                hollywood.getIdiomas().add(ingles);
                hollywood.getPlataformas().add(netflix);
                peliculaRepo.save(hollywood);

                // =================================================================
                // PELÍCULA 3: Dune (2021)
                // =================================================================
                Pelicula dune = new Pelicula();
                dune.setTitulo("Dune");
                dune.setDuracion(155);
                dune.setFechaEstreno(LocalDate.of(2021, 10, 22));
                dune.setPosterUrl("https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg");
                dune.setSinopsis(
                        "Paul Atreides, un joven brillante y talentoso nacido en un gran destino más allá de su comprensión, debe viajar al planeta más peligroso del universo para asegurar el futuro de su familia y su gente.");
                dune.setValoracion(8);
                dune.setDirector(villeneuve);
                dune.getActores().addAll(Arrays.asList(chalamet, zendaya, isaac));
                dune.getCategorias().addAll(Arrays.asList(scifi, aventura, drama));
                dune.getIdiomas().addAll(Arrays.asList(ingles, espanol));
                dune.getPlataformas().add(hbo);
                peliculaRepo.save(dune);

                // =================================================================
                // PELÍCULA 4: El Irlandés (2019)
                // =================================================================
                Pelicula irlandes = new Pelicula();
                irlandes.setTitulo("El Irlandés");
                irlandes.setDuracion(209);
                irlandes.setFechaEstreno(LocalDate.of(2019, 11, 1));
                irlandes.setPosterUrl("https://image.tmdb.org/t/p/w500/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg");
                irlandes.setSinopsis(
                        "Un veterano de la Segunda Guerra Mundial, Frank Sheeran, un estafador y sicario, trabajó junto al sindicato de camioneros más importante del país. Frank recuerda los secretos que guardó como leal miembro de la familia criminal Bufalino.");
                irlandes.setValoracion(8);
                irlandes.setDirector(scorsese);
                irlandes.getActores().addAll(Arrays.asList(deniro, pacino, pesci));
                irlandes.getCategorias().addAll(Arrays.asList(drama, crimen));
                irlandes.getIdiomas().add(ingles);
                irlandes.getPlataformas().add(netflix);
                peliculaRepo.save(irlandes);

                // =================================================================
                // PELÍCULA 5: Parásitos (2019)
                // =================================================================
                Pelicula parasitos = new Pelicula();
                parasitos.setTitulo("Parásitos");
                parasitos.setDuracion(132);
                parasitos.setFechaEstreno(LocalDate.of(2019, 5, 30));
                parasitos.setPosterUrl("https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYj0lCr7QJk.jpg");
                parasitos.setSinopsis(
                        "Toda la familia de Ki-taek está sin trabajo. Cuando su hijo mayor, Ki-woo, empieza a dar clases particulares en casa de los Park, las dos familias, muy distintas entre sí, comienzan una interrelación de resultados impredecibles.");
                parasitos.setValoracion(9);
                parasitos.setDirector(bong);
                parasitos.getActores().addAll(Arrays.asList(songkang, choiwoo));
                parasitos.getCategorias().addAll(Arrays.asList(thriller, drama, comedia));
                parasitos.getIdiomas().addAll(Arrays.asList(coreano, espanol));
                parasitos.getPlataformas().add(prime);
                peliculaRepo.save(parasitos);

                // =================================================================
                // PELÍCULA 6: El club de la pelea (1999)
                // =================================================================
                Pelicula fightclub = new Pelicula();
                fightclub.setTitulo("El club de la pelea");
                fightclub.setDuracion(139);
                fightclub.setFechaEstreno(LocalDate.of(1999, 10, 15));
                fightclub.setPosterUrl("https://image.tmdb.org/t/p/w500/pV2zhzCRRIqUOQmBTMPnjdVe9eP.jpg");
                fightclub.setSinopsis(
                        "Un joven insomne busca algo que dé sentido a su vida. Lo encuentra en un carismático vendedor de jabón que tiene una filosofía muy particular.");
                fightclub.setValoracion(9);
                fightclub.setDirector(fincher);
                fightclub.getActores().addAll(Arrays.asList(pitt, norton));
                fightclub.getCategorias().addAll(Arrays.asList(drama, thriller));
                fightclub.getIdiomas().add(ingles);
                fightclub.getPlataformas().add(disney);
                peliculaRepo.save(fightclub);

                // =================================================================
                // PELÍCULA 7: Matrix (1999)
                // =================================================================
                Pelicula matrix = new Pelicula();
                matrix.setTitulo("Matrix");
                matrix.setDuracion(136);
                matrix.setFechaEstreno(LocalDate.of(1999, 3, 31));
                matrix.setPosterUrl("https://image.tmdb.org/t/p/w500/lZpWprJqbIFpEV5uoHfoK0KCnTW.jpg");
                matrix.setSinopsis(
                        "Thomas Anderson lleva una doble vida: por el día es programador en una importante empresa de software, y por la noche un hacker conocido como Neo. Su vida cambia cuando es contactado por Morfeo.");
                matrix.setValoracion(9);
                matrix.setDirector(wachowski);
                matrix.getActores().addAll(Arrays.asList(reeves, fishburne, moss));
                matrix.getCategorias().addAll(Arrays.asList(scifi, accion));
                matrix.getIdiomas().add(ingles);
                matrix.getPlataformas().add(hbo);
                peliculaRepo.save(matrix);

                // =================================================================
                // PELÍCULA 8: Avengers: Endgame (2019)
                // =================================================================
                Pelicula endgame = new Pelicula();
                endgame.setTitulo("Avengers: Endgame");
                endgame.setDuracion(181);
                endgame.setFechaEstreno(LocalDate.of(2019, 4, 26));
                endgame.setPosterUrl("https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg");
                endgame.setSinopsis(
                        "Después de los devastadores eventos de Avengers: Infinity War, el universo está en ruinas. Con la ayuda de los aliados restantes, los Vengadores se reúnen una vez más para revertir las acciones de Thanos y restaurar el orden en el universo.");
                endgame.setValoracion(8);
                endgame.setDirector(russo);
                endgame.getActores().addAll(Arrays.asList(downey, evans, johansson, hemsworth));
                endgame.getCategorias().addAll(Arrays.asList(accion, aventura, scifi));
                endgame.getIdiomas().addAll(Arrays.asList(ingles, espanol));
                endgame.getPlataformas().add(disney);
                peliculaRepo.save(endgame);

                // =================================================================
                // PELÍCULA 9: Interestelar (2014)
                // =================================================================
                Pelicula interstellar = new Pelicula();
                interstellar.setTitulo("Interestelar");
                interstellar.setDuracion(169);
                interstellar.setFechaEstreno(LocalDate.of(2014, 11, 7));
                interstellar.setPosterUrl("https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg");
                interstellar.setSinopsis(
                        "Un grupo de exploradores hace uso de un agujero de gusano recientemente descubierto para superar las limitaciones de los viajes espaciales humanos y conquistar las vastas distancias involucradas en un viaje interestelar.");
                interstellar.setValoracion(9);
                interstellar.setDirector(nolan);
                interstellar.getActores().addAll(Arrays.asList(mcconaughey, hathaway));
                interstellar.getCategorias().addAll(Arrays.asList(scifi, drama, aventura));
                interstellar.getIdiomas().add(ingles);
                interstellar.getPlataformas().add(prime);
                peliculaRepo.save(interstellar);

                // =================================================================
                // PELÍCULA 10: Cadena Perpetua (1994)
                // =================================================================
                Pelicula shawshank = new Pelicula();
                shawshank.setTitulo("Cadena Perpetua");
                shawshank.setDuracion(142);
                shawshank.setFechaEstreno(LocalDate.of(1994, 9, 23));
                shawshank.setPosterUrl("https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg");
                shawshank.setSinopsis(
                        "Andy Dufresne es un joven y exitoso banquero cuya vida cambia drásticamente cuando es condenado por un crimen que no cometió: el asesinato de su esposa y su amante.");
                shawshank.setValoracion(10);
                shawshank.setDirector(darabont);
                shawshank.getActores().addAll(Arrays.asList(robbins, freeman));
                shawshank.getCategorias().add(drama);
                shawshank.getIdiomas().add(ingles);
                shawshank.getPlataformas().add(netflix);
                peliculaRepo.save(shawshank);

                // =================================================================
                // PELÍCULA 11: Forrest Gump (1994)
                // =================================================================
                Pelicula forrest = new Pelicula();
                forrest.setTitulo("Forrest Gump");
                forrest.setDuracion(142);
                forrest.setFechaEstreno(LocalDate.of(1994, 7, 6));
                forrest.setPosterUrl("https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg");
                forrest.setSinopsis(
                        "Forrest Gump, un hombre con un coeficiente intelectual bajo pero con un gran corazón, cuenta su vida mientras espera en una banca de bus. Sin saberlo, ha sido partícipe de los eventos más importantes de la historia reciente de Estados Unidos.");
                forrest.setValoracion(9);
                forrest.setDirector(zemeckis);
                forrest.getActores().add(hanks);
                forrest.getCategorias().addAll(Arrays.asList(drama, romance, comedia));
                forrest.getIdiomas().add(ingles);
                forrest.getPlataformas().add(netflix);
                peliculaRepo.save(forrest);

                // =================================================================
                // PELÍCULA 12: Black Panther (2018)
                // =================================================================
                Pelicula blackpanther = new Pelicula();
                blackpanther.setTitulo("Black Panther");
                blackpanther.setDuracion(134);
                blackpanther.setFechaEstreno(LocalDate.of(2018, 2, 16));
                blackpanther.setPosterUrl("https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg");
                blackpanther.setSinopsis(
                        "T'Challa regresa a casa, la aislada pero tecnológicamente avanzada nación africana de Wakanda, para convertirse en rey después de la muerte de su padre. Pero cuando un viejo enemigo reaparece, el temple de T'Challa como rey, y como Black Panther, se pone a prueba.");
                blackpanther.setValoracion(8);
                blackpanther.setDirector(coogler);
                blackpanther.getActores().add(boseman);
                blackpanther.getCategorias().addAll(Arrays.asList(accion, aventura, scifi));
                blackpanther.getIdiomas().add(ingles);
                blackpanther.getPlataformas().add(disney);
                peliculaRepo.save(blackpanther);

                // =================================================================
                // PELÍCULA 13: ¡Huye! (Get Out) (2017)
                // =================================================================
                Pelicula getout = new Pelicula();
                getout.setTitulo("¡Huye!");
                getout.setDuracion(104);
                getout.setFechaEstreno(LocalDate.of(2017, 2, 24));
                getout.setPosterUrl("https://image.tmdb.org/t/p/w500/tFXcEccSQMf3zy7CpNmOc0YZdw.jpg");
                getout.setSinopsis(
                        "Chris, un joven afroamericano, descubre un preocupante secreto cuando conoce a la familia de su novia caucásica durante un fin de semana.");
                getout.setValoracion(8);
                getout.setDirector(peele);
                getout.getActores().add(kaluuya);
                getout.getCategorias().addAll(Arrays.asList(terror, thriller));
                getout.getIdiomas().add(ingles);
                getout.getPlataformas().add(netflix);
                peliculaRepo.save(getout);

                // =================================================================
                // PELÍCULA 14: Avatar (2009)
                // =================================================================
                Pelicula avatar = new Pelicula();
                avatar.setTitulo("Avatar");
                avatar.setDuracion(162);
                avatar.setFechaEstreno(LocalDate.of(2009, 12, 18));
                avatar.setPosterUrl("https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg");
                avatar.setSinopsis(
                        "En el exuberante mundo alienígena de Pandora viven los Na'vi, seres que parecen ser primitivos pero que son más evolucionados que los humanos. Jake Sully, un ex-marine inválido, se encuentra dividido entre dos mundos.");
                avatar.setValoracion(8);
                avatar.setDirector(cameron);
                avatar.getActores().addAll(Arrays.asList(worthington, saldana, weaver));
                avatar.getCategorias().addAll(Arrays.asList(scifi, aventura, accion));
                avatar.getIdiomas().add(ingles);
                avatar.getPlataformas().add(disney);
                peliculaRepo.save(avatar);

                // =================================================================
                // PELÍCULA 15: Django Desencadenado (2012)
                // =================================================================
                Pelicula django = new Pelicula();
                django.setTitulo("Django Desencadenado");
                django.setDuracion(165);
                django.setFechaEstreno(LocalDate.of(2012, 12, 25));
                django.setPosterUrl("https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg");
                django.setSinopsis(
                        "Un esclavo liberado se une a un cazarrecompensas alemán para rescatar a su esposa de un terrateniente cruel en el sur de Estados Unidos antes de la Guerra Civil.");
                django.setValoracion(8);
                django.setDirector(tarantino);
                django.getActores().addAll(Arrays.asList(foxx, waltz, dicaprio, jackson));
                django.getCategorias().addAll(Arrays.asList(drama, accion));
                django.getIdiomas().add(ingles);
                django.getPlataformas().add(netflix);
                peliculaRepo.save(django);

                // =================================================================
                // PELÍCULA 16: El caballero de la noche (2008)
                // =================================================================
                Pelicula darkknight = new Pelicula();
                darkknight.setTitulo("El caballero de la noche");
                darkknight.setDuracion(152);
                darkknight.setFechaEstreno(LocalDate.of(2008, 7, 18));
                darkknight.setPosterUrl("https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg");
                darkknight.setSinopsis(
                        "Batman, Gordon y Harvey Dent aúnan fuerzas para acabar con el crimen organizado en Gotham, pero un villano llamado el Joker desata el caos y acaba con el orden en la ciudad.");
                darkknight.setValoracion(9);
                darkknight.setDirector(nolan);
                darkknight.getActores().add(murphy);
                darkknight.getCategorias().addAll(Arrays.asList(accion, crimen, drama));
                darkknight.getIdiomas().add(ingles);
                darkknight.getPlataformas().add(hbo);
                peliculaRepo.save(darkknight);

                // =================================================================
                // PELÍCULA 17: Pulp Fiction (1994)
                // =================================================================
                Pelicula pulp = new Pelicula();
                pulp.setTitulo("Pulp Fiction");
                pulp.setDuracion(154);
                pulp.setFechaEstreno(LocalDate.of(1994, 10, 14));
                pulp.setPosterUrl("https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg");
                pulp.setSinopsis(
                        "Las vidas de dos mafiosos, un boxeador, la esposa de un gángster y dos bandidos se entrelazan en cuatro historias de violencia y redención.");
                pulp.setValoracion(9);
                pulp.setDirector(tarantino);
                pulp.getActores().addAll(Arrays.asList(jackson));
                pulp.getCategorias().addAll(Arrays.asList(crimen, drama));
                pulp.getIdiomas().add(ingles);
                pulp.getPlataformas().add(prime);
                peliculaRepo.save(pulp);

                // =================================================================
                // PELÍCULA 18: La lista de Schindler (1993)
                // =================================================================
                Pelicula schindler = new Pelicula();
                schindler.setTitulo("La lista de Schindler");
                schindler.setDuracion(195);
                schindler.setFechaEstreno(LocalDate.of(1993, 12, 15));
                schindler.setPosterUrl("https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg");
                schindler.setSinopsis(
                        "La historia de Oskar Schindler, un empresario alemán que salvó la vida de más de mil judíos durante el Holocausto al emplearlos en sus fábricas.");
                schindler.setValoracion(9);
                schindler.setDirector(spielberg);
                schindler.getCategorias().addAll(Arrays.asList(drama));
                schindler.getIdiomas().addAll(Arrays.asList(ingles, espanol));
                schindler.getPlataformas().add(netflix);
                peliculaRepo.save(schindler);

                // =================================================================
                // PELÍCULA 19: Up (2009)
                // =================================================================
                Pelicula up = new Pelicula();
                up.setTitulo("Up");
                up.setDuracion(96);
                up.setFechaEstreno(LocalDate.of(2009, 5, 29));
                up.setPosterUrl("https://image.tmdb.org/t/p/w500/mDSBqihGyXeTWdWAWPXJii8VOJ0.jpg");
                up.setSinopsis(
                        "Carl Fredricksen, un viudo de 78 años, viaja a Sudamérica en su casa flotante sostenida por miles de globos. Sin quererlo, lleva consigo a Russell, un explorador de 8 años.");
                up.setValoracion(8);
                up.setDirector(pixar);
                up.getCategorias().addAll(Arrays.asList(animacion, aventura, comedia));
                up.getIdiomas().addAll(Arrays.asList(ingles, espanol));
                up.getPlataformas().add(disney);
                peliculaRepo.save(up);

                // =================================================================
                // PELÍCULA 20: Blade Runner 2049 (2017)
                // =================================================================
                Pelicula bladerunner = new Pelicula();
                bladerunner.setTitulo("Blade Runner 2049");
                bladerunner.setDuracion(164);
                bladerunner.setFechaEstreno(LocalDate.of(2017, 10, 6));
                bladerunner.setPosterUrl("https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg");
                bladerunner.setSinopsis(
                        "El oficial K de la LAPD, un nuevo blade runner, descubre un secreto largamente oculto que podría hundir lo que queda de la sociedad en el caos y le lleva a buscar a Rick Deckard, un antiguo blade runner desaparecido hace 30 años.");
                bladerunner.setValoracion(8);
                bladerunner.setDirector(villeneuve);
                bladerunner.getActores().add(hardy);
                bladerunner.getCategorias().addAll(Arrays.asList(scifi, thriller, drama));
                bladerunner.getIdiomas().add(ingles);
                bladerunner.getPlataformas().add(prime);
                peliculaRepo.save(bladerunner);

                System.out.println(">>> 20 PELÍCULAS cargadas con sus directores y actores");
            } else {
                System.out.println(">>> PELICULAS ya existentes, no se cargan datos de demo");
            }

            System.out.println(">>> Verificación de datos iniciales completada");
        };
    }

    // =================================================================
    // MÉTODOS HELPER
    // =================================================================

    private Categoria getOrCreateCategoria(CategoriaRepository repo, String nombre) {
        return repo.findByNombre(nombre).orElseGet(() -> {
            Categoria c = new Categoria();
            c.setNombre(nombre);
            return repo.save(c);
        });
    }

    private Idioma getOrCreateIdioma(IdiomaRepository repo, String nombre) {
        return repo.findByNombre(nombre).orElseGet(() -> {
            Idioma i = new Idioma();
            i.setNombre(nombre);
            return repo.save(i);
        });
    }

    private Director getOrCreateDirector(DirectorRepository repo, String nombre, String apellido, String fotoUrl) {
        return repo.findByNombreAndApellido(nombre, apellido).orElseGet(() -> {
            Director d = new Director();
            d.setNombre(nombre);
            d.setApellido(apellido);
            d.setFotoUrl(fotoUrl);
            return repo.save(d);
        });
    }

    private Actor getOrCreateActor(ActorRepository repo, String nombre, String apellido, String fotoUrl) {
        return repo.findByNombreAndApellido(nombre, apellido).orElseGet(() -> {
            Actor a = new Actor();
            a.setNombre(nombre);
            a.setApellido(apellido.isEmpty() ? null : apellido);
            a.setFotoUrl(fotoUrl);
            return repo.save(a);
        });
    }
}