package com.ofhcinema.GestionCine.config;

import com.ofhcinema.GestionCine.domain.*;
import com.ofhcinema.GestionCine.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class CineDataLoader implements CommandLineRunner {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final DirectorRepository directorRepository;
    private final ActorRepository actorRepository;
    private final SalaRepository salaRepository;
    private final PeliculaRepository peliculaRepository;
    private final FuncionRepository funcionRepository;
    private final VentaRepository ventaRepository;
    private final EntradaRepository entradaRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (rolRepository.count() == 0) {
            log.info("Base de datos vacía. Cargando datos iniciales...");
            loadData();
            log.info("Datos iniciales cargados correctamente.");
        } else {
            log.info("Base de datos ya contiene datos. Omitiendo carga inicial.");
        }
    }

    private void loadData() {
        // 1. Crear Roles
        Rol rolAdmin = new Rol("ADMIN");
        Rol rolCliente = new Rol("CLIENTE");
        Rol rolEmpleado = new Rol("EMPLEADO");

        rolAdmin = rolRepository.save(rolAdmin);
        rolCliente = rolRepository.save(rolCliente);
        rolEmpleado = rolRepository.save(rolEmpleado);
        log.info("Roles creados: ADMIN, CLIENTE, EMPLEADO");

        // 2. Crear Usuarios
        Usuario admin = new Usuario("admin@cine.com", "admin123", true, rolAdmin);
        Usuario cliente1 = new Usuario("cliente1@email.com", "pass123", true, rolCliente);
        Usuario cliente2 = new Usuario("cliente2@email.com", "pass123", true, rolCliente);
        Usuario empleado = new Usuario("empleado@cine.com", "emp123", true, rolEmpleado);

        admin = usuarioRepository.save(admin);
        cliente1 = usuarioRepository.save(cliente1);
        cliente2 = usuarioRepository.save(cliente2);
        empleado = usuarioRepository.save(empleado);
        log.info("Usuarios creados: admin, cliente1, cliente2, empleado");

        // 3. Crear Directores
        Director spielberg = new Director("Steven Spielberg");
        Director nolan = new Director("Christopher Nolan");
        Director tarantino = new Director("Quentin Tarantino");
        Director villeneuve = new Director("Denis Villeneuve");

        spielberg = directorRepository.save(spielberg);
        nolan = directorRepository.save(nolan);
        tarantino = directorRepository.save(tarantino);
        villeneuve = directorRepository.save(villeneuve);
        log.info("Directores creados: Spielberg, Nolan, Tarantino, Villeneuve");

        // 4. Crear Actores
        Actor dicaprio = new Actor("Leonardo DiCaprio");
        Actor pitt = new Actor("Brad Pitt");
        Actor hanks = new Actor("Tom Hanks");
        Actor chalamet = new Actor("Timothée Chalamet");
        Actor zendaya = new Actor("Zendaya");
        Actor bale = new Actor("Christian Bale");
        Actor caine = new Actor("Michael Caine");
        Actor thurman = new Actor("Uma Thurman");

        dicaprio = actorRepository.save(dicaprio);
        pitt = actorRepository.save(pitt);
        hanks = actorRepository.save(hanks);
        chalamet = actorRepository.save(chalamet);
        zendaya = actorRepository.save(zendaya);
        bale = actorRepository.save(bale);
        caine = actorRepository.save(caine);
        thurman = actorRepository.save(thurman);
        log.info("Actores creados: DiCaprio, Pitt, Hanks, Chalamet, Zendaya, Bale, Caine, Thurman");

        // 5. Crear Salas
        Sala sala1 = new Sala("Sala 1 - IMAX", 200);
        Sala sala2 = new Sala("Sala 2 - 3D", 150);
        Sala sala3 = new Sala("Sala 3 - Standard", 100);
        Sala sala4 = new Sala("Sala VIP", 50);

        sala1 = salaRepository.save(sala1);
        sala2 = salaRepository.save(sala2);
        sala3 = salaRepository.save(sala3);
        sala4 = salaRepository.save(sala4);
        log.info("Salas creadas: IMAX, 3D, Standard, VIP");

        // 6. Crear Películas con Actores
        Pelicula inception = new Pelicula("Inception", 148, 13, nolan);
        Set<Actor> actoresInception = new HashSet<>();
        actoresInception.add(dicaprio);
        actoresInception.add(caine);
        inception.setActores(actoresInception);
        inception = peliculaRepository.save(inception);

        Pelicula darkKnight = new Pelicula("The Dark Knight", 152, 13, nolan);
        Set<Actor> actoresDarkKnight = new HashSet<>();
        actoresDarkKnight.add(bale);
        actoresDarkKnight.add(caine);
        darkKnight.setActores(actoresDarkKnight);
        darkKnight = peliculaRepository.save(darkKnight);

        Pelicula dune = new Pelicula("Dune", 155, 13, villeneuve);
        Set<Actor> actoresDune = new HashSet<>();
        actoresDune.add(chalamet);
        actoresDune.add(zendaya);
        dune.setActores(actoresDune);
        dune = peliculaRepository.save(dune);

        Pelicula killBill = new Pelicula("Kill Bill: Vol. 1", 111, 18, tarantino);
        Set<Actor> actoresKillBill = new HashSet<>();
        actoresKillBill.add(thurman);
        killBill.setActores(actoresKillBill);
        killBill = peliculaRepository.save(killBill);

        Pelicula savingPrivateRyan = new Pelicula("Saving Private Ryan", 169, 18, spielberg);
        Set<Actor> actoresSPR = new HashSet<>();
        actoresSPR.add(hanks);
        savingPrivateRyan.setActores(actoresSPR);
        savingPrivateRyan = peliculaRepository.save(savingPrivateRyan);

        Pelicula onceUpon = new Pelicula("Once Upon a Time in Hollywood", 161, 18, tarantino);
        Set<Actor> actoresOUAT = new HashSet<>();
        actoresOUAT.add(dicaprio);
        actoresOUAT.add(pitt);
        onceUpon.setActores(actoresOUAT);
        onceUpon = peliculaRepository.save(onceUpon);
        log.info("Películas creadas con actores asignados");

        // 7. Crear Funciones (proyecciones)
        LocalDateTime ahora = LocalDateTime.now();

        Funcion funcion1 = new Funcion(ahora.plusDays(1).withHour(18).withMinute(0), new BigDecimal("12.50"), sala1,
                inception);
        Funcion funcion2 = new Funcion(ahora.plusDays(1).withHour(21).withMinute(0), new BigDecimal("12.50"), sala1,
                darkKnight);
        Funcion funcion3 = new Funcion(ahora.plusDays(2).withHour(16).withMinute(30), new BigDecimal("10.00"), sala2,
                dune);
        Funcion funcion4 = new Funcion(ahora.plusDays(2).withHour(20).withMinute(0), new BigDecimal("15.00"), sala4,
                killBill);
        Funcion funcion5 = new Funcion(ahora.plusDays(3).withHour(17).withMinute(0), new BigDecimal("9.50"), sala3,
                savingPrivateRyan);
        Funcion funcion6 = new Funcion(ahora.plusDays(3).withHour(22).withMinute(0), new BigDecimal("11.00"), sala2,
                onceUpon);

        funcion1 = funcionRepository.save(funcion1);
        funcion2 = funcionRepository.save(funcion2);
        funcion3 = funcionRepository.save(funcion3);
        funcion4 = funcionRepository.save(funcion4);
        funcion5 = funcionRepository.save(funcion5);
        funcion6 = funcionRepository.save(funcion6);
        log.info("Funciones creadas para los próximos días");

        // 8. Crear Ventas
        Venta venta1 = new Venta(LocalDateTime.now(), new BigDecimal("25.00"), "TARJETA", "COMPLETADA", cliente1);
        Venta venta2 = new Venta(LocalDateTime.now(), new BigDecimal("30.00"), "EFECTIVO", "COMPLETADA", cliente2);
        Venta venta3 = new Venta(LocalDateTime.now(), new BigDecimal("15.00"), "TARJETA", "PENDIENTE", cliente1);

        venta1 = ventaRepository.save(venta1);
        venta2 = ventaRepository.save(venta2);
        venta3 = ventaRepository.save(venta3);
        log.info("Ventas creadas");

        // 9. Crear Entradas
        Entrada entrada1 = new Entrada(generarCodigoEntrada(), 5, 10, "ACTIVA", venta1, funcion1);
        Entrada entrada2 = new Entrada(generarCodigoEntrada(), 5, 11, "ACTIVA", venta1, funcion1);
        Entrada entrada3 = new Entrada(generarCodigoEntrada(), 3, 7, "ACTIVA", venta2, funcion3);
        Entrada entrada4 = new Entrada(generarCodigoEntrada(), 3, 8, "ACTIVA", venta2, funcion3);
        Entrada entrada5 = new Entrada(generarCodigoEntrada(), 3, 9, "ACTIVA", venta2, funcion3);
        Entrada entrada6 = new Entrada(generarCodigoEntrada(), 1, 5, "PENDIENTE", venta3, funcion4);

        entradaRepository.save(entrada1);
        entradaRepository.save(entrada2);
        entradaRepository.save(entrada3);
        entradaRepository.save(entrada4);
        entradaRepository.save(entrada5);
        entradaRepository.save(entrada6);
        log.info("Entradas creadas");
    }

    private String generarCodigoEntrada() {
        return "ENT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
