# 🔐 Práctica Guiada: Gestión de Roles y Permisos (RBAC) con Spring Security

## 📖 Objetivo

Implementar un sistema de **Role-Based Access Control (RBAC)** en Spring Boot combinando dos mecanismos de seguridad:

1. **`SecurityConfig`**: Control a nivel de **URL** (qué rutas son públicas vs autenticadas)
2. **`@PreAuthorize`**: Control a nivel de **método** (qué rol puede ejecutar cada operación)

---

## 🎯 Mapa de Permisos a Implementar

| Acción | Público | USER | ADMIN |
|--------|---------|------|-------|
| Consultar cartelera (películas) | ✅ | ✅ | ✅ |
| Consultar horarios (sesiones/funciones) | ✅ | ✅ | ✅ |
| Registrarse | ✅ | — | — |
| Login | ✅ | — | — |
| Comprar entradas | ❌ | ✅ | ❌ |
| Ver **mis** ventas | ❌ | ✅ | ❌ |
| Cancelar **mi** venta | ❌ | ✅ | ❌ |
| Ver mi perfil | ❌ | ✅ | ✅ |
| CRUD Películas | ❌ | ❌ | ✅ |
| CRUD Salas | ❌ | ❌ | ✅ |
| CRUD Sesiones | ❌ | ❌ | ✅ |
| Ver **TODAS** las ventas | ❌ | ❌ | ✅ |
| Eliminar ventas | ❌ | ❌ | ✅ |

---

## 📝 Paso 1: Configurar las URLs públicas en `SecurityConfig`

La primera capa de seguridad se aplica a nivel de URL. Aquí decidimos qué endpoints son accesibles sin autenticación.

### Archivo: `security/SecurityConfig.java`

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // ← Habilita @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CustomAuthenticationEntryPoint authEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())                                          // 1️⃣ CSRF deshabilitado
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 2️⃣ Stateless
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()                    // 3️⃣ Auth público
                .requestMatchers("/api/test/**").permitAll()                       // 4️⃣ Test público
                .requestMatchers("/error").permitAll()                             // 5️⃣ Errores Spring
                // 6️⃣ Catálogo público (solo lectura)
                .requestMatchers(HttpMethod.GET, "/api/v1/peliculas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/funciones/**").permitAll()
                .anyRequest().authenticated()                                      // 7️⃣ Todo lo demás → token
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authEntryPoint)   // 8️⃣ 401 en JSON
                .accessDeniedHandler(accessDeniedHandler)   // 9️⃣ 403 en JSON
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // 🔟 Filtro JWT
        return http.build();
    }
}
```

### ¿Por qué esta configuración?

- `@EnableMethodSecurity`: **Imprescindible** para que `@PreAuthorize` funcione en los controllers.
- Las reglas de URL son la **primera línea de defensa**: si una petición GET a `/api/v1/peliculas` no necesita token, la dejamos pasar directamente.
- `anyRequest().authenticated()`: **Todo lo que no sea explícitamente público, requiere JWT**.
- Los `POST/PUT/DELETE` a películas y funciones **no están en `permitAll()`**, así que requieren token. Luego, `@PreAuthorize` en el controller verifica el rol.

---

## 📝 Paso 2: Aplicar `@PreAuthorize` en cada Controller

La segunda capa de seguridad se aplica **método a método**. Esto nos da control granular por rol.

### 2.1 — `PeliculaController` (GET público, escritura ADMIN)

```java
@RestController
@RequestMapping("/api/v1/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService peliculaService;

    // ✅ PÚBLICO - ya permitido por SecurityConfig
    @GetMapping
    public List<PeliculaOutputDTO> listar() { ... }

    @GetMapping("/{id}")
    public PeliculaOutputDTO obtener(@PathVariable Long id) { ... }

    // 🔒 ADMIN - requiere token + rol
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public PeliculaOutputDTO crear(@RequestBody PeliculaInputDTO dto) { ... }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public PeliculaOutputDTO actualizar(@PathVariable Long id, @RequestBody PeliculaInputDTO dto) { ... }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { ... }
}
```

> ⚠️ **Nota**: Los métodos `@GetMapping` no llevan `@PreAuthorize` porque ya están abiertos en `SecurityConfig`. Si los pusiéramos con `@PreAuthorize("permitAll()")` sería redundante.

### 2.2 — `VentaController` (el más complejo: USER compra, ADMIN supervisa)

```java
@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    // 🔒 ADMIN - ver TODAS las ventas de cualquier usuario
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<VentaOutputDTO> listarTodas() { ... }

    // 🔒 ADMIN - ver detalle de cualquier venta
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public VentaOutputDTO obtener(@PathVariable Long id) { ... }

    // 🔒 USER - ver solo SUS propias ventas
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/mis-ventas")
    public List<VentaOutputDTO> misVentas() {
        // El servicio usa SecurityContext para obtener el usuario logueado
        return ventaService.findByUsuarioActual();
    }

    // 🔒 USER - comprar entrada
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/comprar")
    public VentaOutputDTO comprar(@RequestBody VentaInputDTO dto) {
        // El servicio asigna automáticamente el usuario del SecurityContext
        return ventaService.comprar(dto);
    }

    // 🔒 USER - cancelar solo SU venta
    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}/cancelar")
    public VentaOutputDTO cancelar(@PathVariable Long id) {
        // El servicio verifica que la venta pertenece al usuario autenticado
        return ventaService.cancelar(id);
    }

    // 🔒 ADMIN - eliminar cualquier venta
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) { ... }
}
```

### 2.3 — `SalaController` (todo ADMIN)

```java
@RestController
@RequestMapping("/api/v1/salas")
@RequiredArgsConstructor
public class SalaController {

    // Todos los métodos requieren ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<SalaOutputDTO> listar() { ... }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public SalaOutputDTO crear(@RequestBody SalaInputDTO dto) { ... }

    // ... PUT, DELETE también con @PreAuthorize("hasRole('ADMIN')")
}
```

---

## 📝 Paso 3: Seguridad a nivel de datos (Ownership)

No basta con verificar el rol. Para las ventas, el **servicio** debe comprobar que el usuario solo accede a **sus propios datos**.

### `VentaService.java` — Ownership Enforcement

```java
@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;

    // Obtener el usuario autenticado desde Spring Security
    private Usuario getUsuarioActual() {
        String email = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // 🔑 Solo devuelve las ventas del usuario logueado
    public List<VentaOutputDTO> findByUsuarioActual() {
        Usuario usuario = getUsuarioActual();
        return ventaRepository.findByUsuario(usuario).stream()
            .map(ventaMapper::toDTO)
            .toList();
    }

    // 🔑 Solo permite cancelar si la venta es del usuario logueado
    public VentaOutputDTO cancelar(Long ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
            .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
        
        Usuario actual = getUsuarioActual();
        if (!venta.getUsuario().getId().equals(actual.getId())) {
            throw new RuntimeException("No puedes cancelar una venta que no es tuya");
        }
        
        venta.setEstado("CANCELADA");
        return ventaMapper.toDTO(ventaRepository.save(venta));
    }

    // 🔑 Al comprar, se asigna el usuario del SecurityContext (NO del DTO)
    public VentaOutputDTO comprar(VentaInputDTO dto) {
        Usuario comprador = getUsuarioActual();  // ← Seguridad
        Venta venta = new Venta();
        venta.setUsuario(comprador);  // ← NUNCA confiar en el ID del frontend
        // ...
    }
}
```

> 🔴 **IMPORTANTE**: Nunca asignar el usuario desde el DTO. Siempre usar `SecurityContextHolder` para evitar que un usuario suplante a otro.

---

## 📝 Paso 4: Manejo de errores (JSON 401/403)

### `CustomAuthenticationEntryPoint.java` — Error 401

Se dispara cuando una petición llega **sin token** o con un **token inválido/expirado**.

```java
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(
            "{\"status\": 401, \"error\": \"No autenticado\", \"message\": \"Token ausente o expirado\"}"
        );
    }
}
```

### `CustomAccessDeniedHandler.java` — Error 403

Se dispara cuando el usuario **tiene token** pero **no tiene el rol necesario**.

```java
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write(
            "{\"status\": 403, \"error\": \"Acceso denegado\", \"message\": \"No tienes permisos para esta operación\"}"
        );
    }
}
```

---

## 📝 Paso 5: Verificar con Postman

### Flujo de prueba recomendado:

1. **Sin token** → `GET /api/v1/peliculas` → ✅ 200 (público)
2. **Sin token** → `POST /api/v1/peliculas` → ❌ 401 JSON
3. **Login como USER** → Token guardado automáticamente
4. **Con token USER** → `GET /api/v1/ventas/mis-ventas` → ✅ 200
5. **Con token USER** → `POST /api/v1/salas` → ❌ 403 JSON (no es ADMIN)
6. **Con token USER** → `DELETE /api/v1/peliculas/1` → ❌ 403 JSON
7. **Login como ADMIN** → Token actualizado
8. **Con token ADMIN** → `POST /api/v1/peliculas` → ✅ 201
9. **Con token ADMIN** → `GET /api/v1/ventas` → ✅ 200 (ve TODAS las ventas)

---

## 🔑 Resumen: ¿Cuándo usar SecurityConfig vs @PreAuthorize?

| Mecanismo | Cuándo usarlo | Ejemplo |
|-----------|--------------|---------|
| `SecurityConfig.permitAll()` | Rutas que deben ser accesibles **sin ningún token** | `GET /api/v1/peliculas` |
| `SecurityConfig.authenticated()` | Todo lo que necesita al menos un token válido | `anyRequest()` |
| `@PreAuthorize("hasRole('ADMIN')")` | Operaciones restringidas a un rol específico | `POST /api/v1/salas` |
| `@PreAuthorize("hasRole('USER')")` | Operaciones exclusivas de usuarios normales | `POST /api/v1/ventas/comprar` |
| **Código en el Service** | Verificar **propiedad** de los datos (ownership) | `cancelar()` verifica dueño |

> 💡 **Regla de oro**: `SecurityConfig` filtra por URL. `@PreAuthorize` filtra por rol. El Service filtra por propiedad de datos. Las tres capas trabajan juntas.
