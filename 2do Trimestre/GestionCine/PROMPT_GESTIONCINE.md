# PROMPT DEFINITIVO - PROYECTO GESTIONCINE (2º TRIMESTRE) - VERSIÓN ACTUALIZADA

## INSTRUCCIONES

Genera el **proyecto Spring Boot completo** llamado **"GestionCine"** siguiendo estrictamente las directrices del **2º Trimestre** de AaD & PSP. Este es un proyecto de gestión de cine con venta de entradas.

---

## 1. INFORMACIÓN DEL PROYECTO

- **Nombre del proyecto:** GestionCine
- **Paquete raíz:** `com.ofhcinema.GestionCine`
- **Java Version:** 21
- **Spring Boot Version:** 3.2.2
- **Puerto del servidor:** 8081
- **Base de datos:** PostgreSQL 16
  - URL: `jdbc:postgresql://localhost:5432/cine`
  - Usuario: `admin`
  - Contraseña: `admin123`

---

## 2. REGLAS ARQUITECTÓNICAS OBLIGATORIAS

### Restricciones de Código
- **PROHIBIDO** usar `@Builder` de Lombok
- **OBLIGATORIO** usar: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **OBLIGATORIO** crear un constructor manual para datos iniciales (sin ID) en cada entidad
- **OBLIGATORIO** usar MapStruct con `@Mapper(componentModel = "spring")` para conversión DTO-Entidad
- **OBLIGATORIO** poner `@ResponseStatus` en **todos** los endpoints de los controllers
- **OBLIGATORIO** tener un `CineDataLoader` que cargue datos iniciales si la BD está vacía
- **OBLIGATORIO** DTOs segregados en subpaquetes: `dto.create` y `dto.response`
- **OBLIGATORIO** validaciones en los CreateDTO (`@NotBlank`, `@NotNull`, `@Email`, `@Min`, `@DecimalMin`, `@NotEmpty`, `@Valid`)
- **OBLIGATORIO** usar `@Transactional` en servicios (readOnly = true para lecturas)
- **OBLIGATORIO** manejar excepciones con `EntityNotFoundException`
- **OBLIGATORIO** usar enum para `EstadoEntrada` (no String)

### Estructura de Paquetes
```
com.ofhcinema.GestionCine/
├── GestionCineApplication.java
├── config/
│   └── CineDataLoader.java
├── domain/
│   ├── Actor.java
│   ├── Director.java
│   ├── Entrada.java
│   ├── EstadoEntrada.java (ENUM)
│   ├── Funcion.java
│   ├── Pelicula.java
│   ├── Rol.java
│   ├── Sala.java
│   ├── Usuario.java
│   └── Venta.java
├── repository/
│   └── (9 interfaces Repository)
├── dto/
│   ├── create/
│   │   └── (9 CreateDTOs)
│   └── response/
│       └── (9 ResponseDTOs)
├── mapper/
│   └── (9 interfaces Mapper)
├── service/
│   └── (9 clases Service)
└── web/
    └── (9 Controllers REST)
```

---

## 3. ARCHIVOS DE CONFIGURACIÓN

### 3.1 pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.2.2</version>
		<relativePath/>
	</parent>
	<groupId>com.ofhcinema</groupId>
	<artifactId>GestionCine</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>GestionCine</name>
	<description>Proyecto de Cine con venta de entradas para el 2 Trimestre de AaD &amp; PSP</description>
	
	<properties>
		<java.version>21</java.version>
		<org.mapstruct.version>1.5.5.Final</org.mapstruct.version>
		<org.lombok.version>1.18.30</org.lombok.version>
	</properties>
	
	<dependencies>
		<!-- Spring Boot Starters -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-validation</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<!-- DevTools -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		
		<!-- Database -->
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>
		
		<!-- Lombok -->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<version>${org.lombok.version}</version>
			<optional>true</optional>
		</dependency>
		
		<!-- MapStruct -->
		<dependency>
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct</artifactId>
			<version>${org.mapstruct.version}</version>
		</dependency>
		
		<!-- Test -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<version>3.11.0</version>
				<configuration>
					<source>${java.version}</source>
					<target>${java.version}</target>
					<annotationProcessorPaths>
						<path>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
							<version>${org.lombok.version}</version>
						</path>
						<path>
							<groupId>org.mapstruct</groupId>
							<artifactId>mapstruct-processor</artifactId>
							<version>${org.mapstruct.version}</version>
						</path>
						<path>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok-mapstruct-binding</artifactId>
							<version>0.2.0</version>
						</path>
					</annotationProcessorPaths>
					<compilerArgs>
						<arg>-Amapstruct.defaultComponentModel=spring</arg>
					</compilerArgs>
				</configuration>
			</plugin>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>
```

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
# Server Configuration
server.port=8081

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/cine
spring.datasource.username=admin
spring.datasource.password=admin123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Logging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

---

## 4. MODELO DE DATOS (ENTIDADES)

### 4.1 EstadoEntrada (ENUM)
```java
public enum EstadoEntrada {
    RESERVADA,  // Entrada reservada pero aún no pagada
    PAGADA,     // Entrada pagada y lista para usar
    USADA,      // Entrada ya usada (escaneada en la sala)
    CANCELADA   // Entrada cancelada
}
```

### 4.2 Rol
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| nombre | String | @Column(nullable=false, unique=true) |
| usuarios | List<Usuario> | @OneToMany(mappedBy="rol", cascade=ALL) |
| **Constructor manual:** | `Rol(String nombre)` |

### 4.3 Usuario
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| email | String | @Column(nullable=false, unique=true) |
| password | String | @Column(nullable=false) |
| enabled | Boolean | @Column(nullable=false), default=true |
| rol | Rol | @ManyToOne(LAZY), @JoinColumn(name="rol_id", nullable=false) |
| ventas | List<Venta> | @OneToMany(mappedBy="usuario", cascade=ALL) |
| **Constructor manual:** | `Usuario(String email, String password, Boolean enabled, Rol rol)` |

### 4.4 Director
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| nombre | String | @Column(nullable=false) |
| peliculas | List<Pelicula> | @OneToMany(mappedBy="director", cascade=ALL) |
| **Constructor manual:** | `Director(String nombre)` |

### 4.5 Actor
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| nombre | String | @Column(nullable=false) |
| peliculas | Set<Pelicula> | @ManyToMany(mappedBy="actores") |
| **Constructor manual:** | `Actor(String nombre)` |

### 4.6 Pelicula
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| titulo | String | @Column(nullable=false) |
| duracion | Integer | @Column(nullable=false), minutos |
| edadMinima | Integer | @Column(name="edad_minima") |
| director | Director | @ManyToOne(LAZY), @JoinColumn(name="director_id") |
| actores | Set<Actor> | @ManyToMany, @JoinTable(name="pelicula_actor"...) |
| funciones | List<Funcion> | @OneToMany(mappedBy="pelicula", cascade=ALL) |
| **Constructor manual:** | `Pelicula(String titulo, Integer duracion, Integer edadMinima, Director director)` |

### 4.7 Sala
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| nombre | String | @Column(nullable=false, unique=true) |
| capacidad | Integer | @Column(nullable=false) |
| funciones | List<Funcion> | @OneToMany(mappedBy="sala", cascade=ALL) |
| **Constructor manual:** | `Sala(String nombre, Integer capacidad)` |

### 4.8 Funcion
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| fechaHora | LocalDateTime | @Column(name="fecha_hora", nullable=false) |
| precio | BigDecimal | @Column(nullable=false, precision=10, scale=2) |
| sala | Sala | @ManyToOne(LAZY), @JoinColumn(name="sala_id", nullable=false) |
| pelicula | Pelicula | @ManyToOne(LAZY), @JoinColumn(name="pelicula_id", nullable=false) |
| entradas | List<Entrada> | @OneToMany(mappedBy="funcion", cascade=ALL) |
| **Constructor manual:** | `Funcion(LocalDateTime fechaHora, BigDecimal precio, Sala sala, Pelicula pelicula)` |

### 4.9 Venta
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| fecha | LocalDateTime | @Column(nullable=false) |
| importeTotal | BigDecimal | @Column(name="importe_total", nullable=false, precision=10, scale=2) |
| metodoPago | String | @Column(name="metodo_pago", nullable=false) |
| estado | String | @Column(nullable=false), PENDIENTE/COMPLETADA/CANCELADA |
| usuario | Usuario | @ManyToOne(LAZY), @JoinColumn(name="usuario_id", nullable=false) |
| entradas | List<Entrada> | @OneToMany(mappedBy="venta", cascade=ALL) |
| **Constructor manual:** | `Venta(LocalDateTime fecha, BigDecimal importeTotal, String metodoPago, String estado, Usuario usuario)` |

### 4.10 Entrada
| Campo | Tipo | Anotaciones |
|-------|------|-------------|
| id | Long | @Id, @GeneratedValue(IDENTITY) |
| codigo | String | @Column(nullable=false, unique=true) |
| fila | Integer | @Column(nullable=false) |
| asiento | Integer | @Column(nullable=false) |
| estado | **EstadoEntrada** | @Enumerated(EnumType.STRING), @Column(nullable=false) |
| venta | Venta | @ManyToOne(LAZY), @JoinColumn(name="venta_id", nullable=false) |
| funcion | Funcion | @ManyToOne(LAZY), @JoinColumn(name="funcion_id", nullable=false) |
| **Constructor manual:** | `Entrada(String codigo, Integer fila, Integer asiento, EstadoEntrada estado, Venta venta, Funcion funcion)` |

---

## 5. REPOSITORIES

| Repository | Métodos Personalizados |
|------------|------------------------|
| RolRepository | `Optional<Rol> findByNombre(String nombre)` |
| UsuarioRepository | `Optional<Usuario> findByEmail(String email)`, `boolean existsByEmail(String email)` |
| DirectorRepository | `Optional<Director> findByNombre(String nombre)` |
| ActorRepository | `Optional<Actor> findByNombre(String nombre)` |
| PeliculaRepository | `Optional<Pelicula> findByTitulo(String titulo)`, `List<Pelicula> findByDirectorId(Long directorId)` |
| SalaRepository | `Optional<Sala> findByNombre(String nombre)` |
| FuncionRepository | `List<Funcion> findBySalaId(Long salaId)`, `List<Funcion> findByPeliculaId(Long peliculaId)`, `List<Funcion> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin)` |
| VentaRepository | `List<Venta> findByUsuarioId(Long usuarioId)`, `List<Venta> findByEstado(String estado)` |
| EntradaRepository | `List<Entrada> findByVentaId(Long ventaId)`, `List<Entrada> findByFuncionId(Long funcionId)`, `Optional<Entrada> findByCodigo(String codigo)`, `boolean existsByFuncionIdAndFilaAndAsiento(Long funcionId, Integer fila, Integer asiento)` |

---

## 6. DTOs

### 6.1 CreateDTOs (paquete: `dto.create`)

**IMPORTANTE - VentaCreateDTO con entradas anidadas:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaCreateDTO {
    @NotNull private LocalDateTime fecha;
    @NotNull private BigDecimal importeTotal;
    @NotBlank private String metodoPago;
    @NotBlank private String estado;
    @NotNull private Long usuarioId;
    
    @NotEmpty(message = "Debe incluir al menos una entrada")
    @Valid
    private List<EntradaVentaDTO> entradas;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EntradaVentaDTO {
        @NotNull @Min(1) private Integer fila;
        @NotNull @Min(1) private Integer asiento;
        @NotNull private Long funcionId;
    }
}
```

**EntradaCreateDTO usa el enum:**
```java
@NotNull private EstadoEntrada estado; // NO String
```

### 6.2 ResponseDTOs (paquete: `dto.response`)

**EntradaResponseDTO:**
```java
private EstadoEntrada estado; // Enum, no String
```

---

## 7. MAPPERS (MapStruct)

Todos con `@Mapper(componentModel = "spring")`.

Mappings importantes:
- `toEntity`: ignora `id` y relaciones
- `toResponseDTO`: mapea propiedades anidadas (ej: `source = "usuario.email", target = "usuarioEmail"`)
- Para `Set<Actor>` → `Set<String>`: usar `@Named` con método default

---

## 8. SERVICES

### VentaService - Lógica Especial
El método `create()` debe:
1. Crear la Venta
2. Para cada `EntradaVentaDTO` de la lista:
   - Verificar que el asiento no esté ocupado: `entradaRepository.existsByFuncionIdAndFilaAndAsiento(...)`
   - Si está ocupado: `throw new IllegalStateException(...)`
   - Generar código: `"ENT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()`
   - Crear Entrada con estado `EstadoEntrada.PAGADA`
   - Guardar entrada

---

## 9. CONTROLLERS (REST)

Cada endpoint debe tener `@ResponseStatus`:
- POST: `HttpStatus.CREATED`
- GET: `HttpStatus.OK`
- PUT: `HttpStatus.OK`
- DELETE: `HttpStatus.NO_CONTENT`

Usar `@Valid` en `@RequestBody`.

---

## 10. CineDataLoader

Debe implementar `CommandLineRunner` con:
- `@Component`, `@RequiredArgsConstructor`, `@Slf4j`
- Método `run()` con `@Transactional`
- Solo cargar si `rolRepository.count() == 0`
- Usar constructores manuales (sin ID)
- Usar `EstadoEntrada.PAGADA` y `EstadoEntrada.RESERVADA` (NO Strings)
- Generar códigos de entrada con UUID

**Orden de carga:**
1. Roles (ADMIN, CLIENTE, EMPLEADO)
2. Usuarios (admin, cliente1, cliente2, empleado)
3. Directores (Spielberg, Nolan, Tarantino, Villeneuve)
4. Actores (DiCaprio, Pitt, Hanks, Chalamet, Zendaya, Bale, Caine, Thurman)
5. Salas (IMAX, 3D, Standard, VIP)
6. Películas con actores
7. Funciones con fechas futuras
8. Ventas
9. Entradas con estados PAGADA y RESERVADA

---

## 11. POSTMAN COLLECTION

Generar `GestionCine_Postman_Collection.json` con:
- Carpeta por entidad
- Todos los endpoints CRUD
- URL base: `http://localhost:8081/api/`

---

## RESUMEN - ARCHIVOS A GENERAR

| Carpeta | Archivos |
|---------|----------|
| raíz | pom.xml, docker-compose.yml |
| resources | application.properties |
| domain | Rol, Usuario, Director, Actor, Pelicula, Sala, Funcion, Venta, Entrada, **EstadoEntrada** (ENUM) |
| repository | 9 interfaces |
| dto/create | 9 CreateDTOs (VentaCreateDTO con EntradaVentaDTO anidado) |
| dto/response | 9 ResponseDTOs |
| mapper | 9 Mappers |
| service | 9 Services |
| web | 9 Controllers |
| config | CineDataLoader |
| raíz | GestionCine_Postman_Collection.json |

**TOTAL: ~60 archivos**

---

*¡Genera TODO el código completo de una sola vez!*
