# PROMPT DEFINITIVO - PROYECTO GESTIONCINE (2º TRIMESTRE)

## INSTRUCCIONES PARA CLAUDE

Genera el **proyecto Spring Boot completo** llamado **"GestionCine"** siguiendo estrictamente las directrices del **2º Trimestre** de AaD & PSP. Este es un proyecto de gestión de cine con venta de entradas.

---

## 1. INFORMACIÓN DEL PROYECTO

### Datos Básicos
- **Nombre del proyecto:** GestionCine
- **Paquete raíz:** `com.ofhcinema.GestionCine`
- **Java Version:** 21
- **Spring Boot Version:** 3.2.2
- **Puerto del servidor:** 8081
- **Base de datos:** PostgreSQL 16
  - Host: localhost
  - Puerto: 5432
  - Base de datos: cine
  - Usuario: admin
  - Contraseña: admin123

---

## 2. REGLAS ARQUITECTÓNICAS OBLIGATORIAS

### 2.1 Restricciones de Código
- **PROHIBIDO** usar `@Builder` de Lombok
- **OBLIGATORIO** usar: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **OBLIGATORIO** crear un constructor manual para datos iniciales (sin ID) en cada entidad
- **OBLIGATORIO** usar MapStruct con `@Mapper(componentModel = "spring")` para conversión DTO-Entidad
- **OBLIGATORIO** poner `@ResponseStatus` en **todos** los endpoints de los controllers
- **OBLIGATORIO** tener un `DataLoader` que cargue datos iniciales si la BD está vacía
- **OBLIGATORIO** DTOs segregados en subpaquetes: `dto.create` y `dto.response`
- **OBLIGATORIO** validaciones en los CreateDTO (`@NotBlank`, `@NotNull`, `@Email`, `@Min`, `@DecimalMin`)
- **OBLIGATORIO** usar `@Transactional` en servicios (readOnly = true para lecturas)
- **OBLIGATORIO** manejar excepciones con `EntityNotFoundException`
- **OBLIGATORIO** tener un `GlobalExceptionHandler` con `@RestControllerAdvice`

### 2.2 Estructura de Paquetes
```
com.ofhcinema.GestionCine/
├── domain/           # Entidades JPA
├── repository/       # Interfaces JpaRepository
├── dto/
│   ├── create/      # DTOs de creación con validaciones
│   └── response/    # DTOs de respuesta
├── mapper/          # Interfaces MapStruct
├── service/         # Lógica de negocio
├── web/             # Controllers REST
└── config/          # DataLoader, GlobalExceptionHandler
```

---

## 3. ARCHIVOS DE CONFIGURACIÓN

### 3.1 pom.xml
Debe incluir:
- Parent: spring-boot-starter-parent 3.2.2
- Dependencias: spring-boot-starter-data-jpa, spring-boot-starter-web, spring-boot-starter-validation, postgresql, lombok, mapstruct (1.5.5.Final)
- Plugin maven-compiler-plugin configurado con lombok y mapstruct-processor
- Agregar lombok-mapstruct-binding para integración

### 3.2 docker-compose.yml
```yaml
version: '3.8'
services:
  db:
    image: postgres:16
    container_name: postgres_db
    restart: always
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin123
      - POSTGRES_DB=cine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  phppgadmin:
    image: dpage/pgadmin4
    container_name: phppgadmin
    restart: always
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@admin.com
      - PGADMIN_DEFAULT_PASSWORD=admin123
    ports:
      - "8080:80"

volumes:
  postgres_data:
```

### 3.3 application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cine
spring.datasource.username=admin
spring.datasource.password=admin123
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
server.port=8081
```

---

## 4. MODELO DE DATOS (ENTIDADES)

### 4.1 Rol
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| nombre | String | ADMIN, CLIENTE, EMPLEADO |
| **Relaciones** | 1:N | usuarios (mappedBy) |

### 4.2 Usuario
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| email | String | Único |
| password | String | |
| enabled | Boolean | Por defecto true |
| **Relaciones** | N:1 | rol (FK) |
| **Relaciones** | 1:N | ventas (mappedBy) |

### 4.3 Director
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| nombre | String | |
| **Relaciones** | 1:N | peliculas (mappedBy) |

### 4.4 Actor
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| nombre | String | |
| **Relaciones** | N:M | peliculas (mappedBy) |

### 4.5 Pelicula
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| titulo | String | |
| duracion | Integer | Minutos |
| edadMinima | Integer | 0, 7, 12, 16, 18 |
| **Relaciones** | N:1 | director (FK) |
| **Relaciones** | N:M | actores (@JoinTable pelicula_actor) |
| **Relaciones** | 1:N | funciones (mappedBy) |

### 4.6 Sala
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| nombre | String | Ej: "Sala 1 - IMAX" |
| capacidad | Integer | Número de butacas |
| **Relaciones** | 1:N | funciones (mappedBy) |

### 4.7 Funcion (Proyección/Sesión)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| fechaHora | LocalDateTime | Fecha y hora de la sesión |
| precio | Double | Precio de la entrada |
| **Relaciones** | N:1 | sala (FK) |
| **Relaciones** | N:1 | pelicula (FK) |
| **Relaciones** | 1:N | entradas (mappedBy) |

### 4.8 Venta
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| fecha | LocalDateTime | Momento de la compra |
| importeTotal | Double | Total pagado |
| metodoPago | String | TARJETA, EFECTIVO |
| estado | String | PENDIENTE, COMPLETADA, CANCELADA |
| **Relaciones** | N:1 | usuario (FK) |
| **Relaciones** | 1:N | entradas (mappedBy) |

### 4.9 Entrada
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Long | PK, GeneratedValue |
| codigo | String | Código único (UUID) |
| fila | Integer | Número de fila |
| asiento | Integer | Número de asiento |
| estado | String | ACTIVA, USADA, CANCELADA |
| **Relaciones** | N:1 | venta (FK) |
| **Relaciones** | N:1 | funcion (FK) |

---

## 5. REPOSITORIES

Crear interfaces `JpaRepository<Entity, Long>` para cada entidad con métodos personalizados:

| Repository | Métodos Adicionales |
|------------|---------------------|
| RolRepository | findByNombre(String) |
| UsuarioRepository | findByEmail(String), existsByEmail(String) |
| DirectorRepository | findByNombre(String) |
| ActorRepository | findByNombre(String) |
| PeliculaRepository | findByTitulo(String), findByDirectorId(Long) |
| SalaRepository | findByNombre(String) |
| FuncionRepository | findBySalaId(Long), findByPeliculaId(Long), findByFechaHoraBetween(LocalDateTime, LocalDateTime) |
| VentaRepository | findByUsuarioId(Long), findByEstado(String) |
| EntradaRepository | findByVentaId(Long), findByFuncionId(Long), findByCodigo(String), existsByFuncionIdAndFilaAndAsiento(Long, Integer, Integer) |

---

## 6. DTOs

### 6.1 CreateDTOs (paquete: dto.create)
Incluir validaciones con anotaciones de Jakarta Validation:
- `@NotBlank`, `@NotNull`, `@Email`, `@Min`, `@DecimalMin`

Para relaciones, usar IDs (ej: `rolId`, `directorId`, `actorIds`)

### 6.2 ResponseDTOs (paquete: dto.response)
Aplanar relaciones:
- Usuario: `rolNombre` en vez de objeto Rol
- Pelicula: `directorNombre`, `actoresNombres` (Set<String>)
- Funcion: `salaNombre`, `peliculaTitulo`
- Venta: `usuarioEmail`
- Entrada: `ventaId`, `peliculaTitulo`, `funcionFechaHora`

---

## 7. MAPPERS (MapStruct)

Cada mapper debe:
1. Tener `@Mapper(componentModel = "spring")`
2. Método `toEntity(CreateDTO dto)` que ignore id y relaciones
3. Método `toResponseDTO(Entity entity)` con mappings para propiedades anidadas
4. Método `toResponseDTOList(List<Entity> entities)`
5. Métodos `@Named` para conversiones complejas (ej: Set<Actor> → Set<String>)

---

## 8. SERVICES

Cada servicio debe:
1. Tener `@Service`, `@RequiredArgsConstructor`, `@Transactional`
2. Inyectar repository y mapper correspondientes
3. Métodos CRUD: create, findAll, findById, update, delete
4. Manejar `EntityNotFoundException` para entidades no encontradas
5. Cargar relaciones desde repositories antes de guardar
6. Usar `@Transactional(readOnly = true)` en lecturas

---

## 9. CONTROLLERS (REST)

Cada controller debe:
1. Tener `@RestController`, `@RequestMapping("/api/<entidad>")`, `@RequiredArgsConstructor`
2. **OBLIGATORIO:** `@ResponseStatus` en cada endpoint:
   - POST: `HttpStatus.CREATED`
   - GET: `HttpStatus.OK`
   - PUT: `HttpStatus.OK`
   - DELETE: `HttpStatus.NO_CONTENT`
3. Usar `@Valid` en `@RequestBody` para validación
4. Endpoints básicos: POST, GET (all), GET/{id}, PUT/{id}, DELETE/{id}
5. Endpoints adicionales según filtros (ej: /email/{email}, /director/{id})

---

## 10. CONFIGURATION

### 10.1 CineDataLoader
Clase que implementa `CommandLineRunner`:
- Cargar datos SOLO si `rolRepository.count() == 0`
- Orden de carga:
  1. Roles (ADMIN, CLIENTE, EMPLEADO)
  2. Usuarios
  3. Directores
  4. Actores
  5. Salas
  6. Películas (con actores asignados)
  7. Funciones
  8. Ventas
  9. Entradas
- Usar constructores manuales (sin ID)
- Generar códigos de entrada con UUID

### 10.2 GlobalExceptionHandler
Clase con `@RestControllerAdvice`:
- Handler para `EntityNotFoundException` → 404 NOT_FOUND
- Handler para `MethodArgumentNotValidException` → 400 BAD_REQUEST
- Handler para `IllegalStateException` → 409 CONFLICT
- Handler genérico para `Exception` → 500 INTERNAL_SERVER_ERROR
- Formato de respuesta: timestamp, status, error, message/errors

---

## 11. POSTMAN COLLECTION

Generar archivo JSON con Postman Collection 2.1:
- Carpeta por cada entidad
- Requests para todos los endpoints
- Ejemplos de body para POST/PUT
- URL base: `http://localhost:8081`

---

## 12. DATOS INICIALES SUGERIDOS

### Roles
- ADMIN, CLIENTE, EMPLEADO

### Usuarios
- admin@cine.com (ADMIN)
- cliente1@email.com, cliente2@email.com (CLIENTE)
- empleado@cine.com (EMPLEADO)

### Directores
- Steven Spielberg, Christopher Nolan, Quentin Tarantino, Denis Villeneuve

### Actores
- Leonardo DiCaprio, Brad Pitt, Tom Hanks, Timothée Chalamet, Zendaya, Christian Bale, Michael Caine, Uma Thurman

### Salas
- Sala 1 - IMAX (200), Sala 2 - 3D (150), Sala 3 - Standard (100), Sala VIP (50)

### Películas
- Inception (Nolan, 148min, +13)
- The Dark Knight (Nolan, 152min, +13)
- Dune (Villeneuve, 155min, +13)
- Kill Bill Vol.1 (Tarantino, 111min, +18)
- Saving Private Ryan (Spielberg, 169min, +18)
- Once Upon a Time in Hollywood (Tarantino, 161min, +18)

### Funciones
- Varias sesiones en días próximos con precios entre 9.50€ y 15.00€

### Ventas y Entradas
- 2-3 ventas de prueba con entradas asociadas

---

## 13. VERIFICACIÓN

Después de generar todo:
1. Ejecutar `docker-compose up -d` para PostgreSQL
2. Ejecutar `./mvnw clean compile` - debe dar BUILD SUCCESS
3. Ejecutar `./mvnw spring-boot:run`
4. Probar endpoints con Postman

---

## RESUMEN DE ARCHIVOS A GENERAR

| Carpeta | Archivos |
|---------|----------|
| / | pom.xml, docker-compose.yml |
| src/main/resources | application.properties |
| domain | Rol, Usuario, Director, Actor, Pelicula, Sala, Funcion, Venta, Entrada |
| repository | 9 interfaces Repository |
| dto/create | 9 CreateDTO |
| dto/response | 9 ResponseDTO |
| mapper | 9 interfaces Mapper |
| service | 9 clases Service |
| web | 9 clases Controller |
| config | CineDataLoader, GlobalExceptionHandler |
| / | GestionCine_Postman_Collection.json |

**TOTAL: ~55+ archivos Java + configuración**

---

*¡Genera TODO el código de una sola vez, sin omitir nada!*
