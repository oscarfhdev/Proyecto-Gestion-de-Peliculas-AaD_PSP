package gestionPeliculas.config;

import gestionPeliculas.domain.Plataforma;
import gestionPeliculas.domain.Usuario;
import gestionPeliculas.repository.PlataformaRepository;
import gestionPeliculas.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepo, PlataformaRepository plataformaRepo,
            gestionPeliculas.repository.SalaRepository salaRepo) {
        return args -> {
            System.out.println(">>> Verificando datos iniciales...");

            // =====================================================
            // USUARIOS
            // =====================================================

            // Admin
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

            // Usuario normal
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
            // PLATAFORMAS
            // =====================================================

            // Netflix
            if (plataformaRepo.findByNombre("Netflix").isEmpty()) {
                Plataforma netflix = new Plataforma();
                netflix.setNombre("Netflix");
                netflix.setUrl("https://image.tmdb.org/t/p/original/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg");
                plataformaRepo.save(netflix);
                System.out.println(">>> Plataforma NETFLIX creada");
            }

            // Disney+
            if (plataformaRepo.findByNombre("Disney+").isEmpty()) {
                Plataforma disney = new Plataforma();
                disney.setNombre("Disney+");
                disney.setUrl("https://image.tmdb.org/t/p/original/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg");
                plataformaRepo.save(disney);
                System.out.println(">>> Plataforma DISNEY+ creada");
            }

            // HBO Max
            if (plataformaRepo.findByNombre("HBO Max").isEmpty()) {
                Plataforma hbo = new Plataforma();
                hbo.setNombre("HBO Max");
                hbo.setUrl("https://image.tmdb.org/t/p/original/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg");
                plataformaRepo.save(hbo);
                System.out.println(">>> Plataforma HBO MAX creada");
            }

            // Prime Video
            if (plataformaRepo.findByNombre("Amazon Prime Video").isEmpty()) {
                Plataforma prime = new Plataforma();
                prime.setNombre("Prime Video");
                prime.setUrl("https://image.tmdb.org/t/p/original/emthp39XA2YScoYL1p0sdbAH2WA.jpg");
                plataformaRepo.save(prime);
                System.out.println(">>> Plataforma PRIME VIDEO creada");
            }

            // =====================================================
            // SALAS
            // =====================================================
            if (salaRepo.count() == 0) {
                gestionPeliculas.domain.Sala sala1 = new gestionPeliculas.domain.Sala();
                sala1.setNumeroSala(1L);
                sala1.setCapacidad(100L);
                salaRepo.save(sala1);

                gestionPeliculas.domain.Sala sala2 = new gestionPeliculas.domain.Sala();
                sala2.setNumeroSala(2L);
                sala2.setCapacidad(150L);
                salaRepo.save(sala2);

                gestionPeliculas.domain.Sala sala3 = new gestionPeliculas.domain.Sala();
                sala3.setNumeroSala(3L);
                sala3.setCapacidad(200L);
                salaRepo.save(sala3);
                System.out.println(">>> 3 SALAS creadas por defecto");
            } else {
                System.out.println(">>> SALAS ya existentes");
            }

            System.out.println(">>> Verificación de datos iniciales completada");
        };
    }
}