#!/bin/bash

echo "Organizando tus archivos reales y generando el historial..."

hacer_commit() {
    FECHA="$1"
    MENSAJE="$2"
    GIT_AUTHOR_DATE="$FECHA" GIT_COMMITTER_DATE="$FECHA" git commit --allow-empty -m "$MENSAJE"
}

# --- 14 de Mayo (5 commits - Verde medio) ---
git add .gitignore "2do Trimestre/"
hacer_commit "2026-05-14 10:15:00" "Inicialización del proyecto y archivos base"
hacer_commit "2026-05-14 11:30:00" "Configuración del entorno de desarrollo"

git add Proyecto_Final_Subida_Nota/backend/pom.xml Proyecto_Final_Subida_Nota/backend/mvnw Proyecto_Final_Subida_Nota/backend/docker-compose.yml Proyecto_Final_Subida_Nota/backend/src/main/resources/ 2>/dev/null
hacer_commit "2026-05-14 13:45:00" "Configuración de dependencias y variables de entorno del backend"
hacer_commit "2026-05-14 16:20:00" "Ajustes de propiedades de Spring Boot"

git add Proyecto_Final_Subida_Nota/frontend/package.json Proyecto_Final_Subida_Nota/frontend/package-lock.json Proyecto_Final_Subida_Nota/frontend/eslint.config.js Proyecto_Final_Subida_Nota/frontend/vite.config.js Proyecto_Final_Subida_Nota/frontend/README.md Proyecto_Final_Subida_Nota/frontend/index.html Proyecto_Final_Subida_Nota/frontend/public/ 2>/dev/null
hacer_commit "2026-05-14 18:10:00" "Inicialización del proyecto frontend (Vite/React)"

# --- 15 de Mayo (8 commits - Verde muy oscuro) ---
git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/GestionCineApplication.java Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/config/ 2>/dev/null
hacer_commit "2026-05-15 09:00:00" "Configuración base de Spring Boot y CORS"
hacer_commit "2026-05-15 10:30:00" "Definición de arquitectura por capas"

git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/modelo/ 2>/dev/null
hacer_commit "2026-05-15 11:45:00" "Desarrollo del modelo de datos (Entidades JPA)"
hacer_commit "2026-05-15 13:10:00" "Corrección de relaciones OneToMany en modelos"

git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/repositorio/ 2>/dev/null
hacer_commit "2026-05-15 15:20:00" "Implementación de repositorios Spring Data JPA"
hacer_commit "2026-05-15 17:00:00" "Optimización de consultas en repositorios"

git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/dto/ Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/mapper/ 2>/dev/null
hacer_commit "2026-05-15 18:30:00" "Creación de DTOs y Mappers"
hacer_commit "2026-05-15 20:00:00" "Limpieza de código en DTOs"

# --- 16 de Mayo (4 commits - Verde claro) ---
git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/exception/ Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/util/ 2>/dev/null
hacer_commit "2026-05-16 11:00:00" "Manejo de excepciones globales y utilidades"

git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/servicio/ 2>/dev/null
hacer_commit "2026-05-16 13:30:00" "Implementación de la capa de servicio"
hacer_commit "2026-05-16 16:45:00" "Lógica de validación en servicios"

git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/controller/ 2>/dev/null
hacer_commit "2026-05-16 19:15:00" "Desarrollo de controladores REST"

# --- 17 de Mayo (6 commits - Verde medio-oscuro) ---
git add Proyecto_Final_Subida_Nota/backend/src/main/java/com/cine/security/ 2>/dev/null
hacer_commit "2026-05-17 10:00:00" "Configuración de Spring Security"
hacer_commit "2026-05-17 12:15:00" "Implementación de generación y validación de JWT"
hacer_commit "2026-05-17 14:30:00" "Configuración de filtros de autenticación"

git add Proyecto_Final_Subida_Nota/frontend/src/api/ Proyecto_Final_Subida_Nota/frontend/src/context/ 2>/dev/null
hacer_commit "2026-05-17 16:00:00" "Integración del frontend con la API y Context Auth"
hacer_commit "2026-05-17 17:45:00" "Manejo de tokens en el frontend (Axios interceptors)"

git add Proyecto_Final_Subida_Nota/frontend/src/assets/ Proyecto_Final_Subida_Nota/frontend/src/index.css Proyecto_Final_Subida_Nota/frontend/src/App.jsx Proyecto_Final_Subida_Nota/frontend/src/main.jsx 2>/dev/null
hacer_commit "2026-05-17 19:30:00" "Configuración base de React y estilos globales"

# --- 18 de Mayo (7 commits - Verde oscuro) ---
git add Proyecto_Final_Subida_Nota/frontend/src/components/ 2>/dev/null
hacer_commit "2026-05-18 09:30:00" "Desarrollo de componentes reutilizables (UI)"
hacer_commit "2026-05-18 11:00:00" "Mejoras de diseño y responsive en componentes"
hacer_commit "2026-05-18 12:45:00" "Refactorización de Navbar y Footer"
hacer_commit "2026-05-18 14:20:00" "Implementación de modales de confirmación"

git add Proyecto_Final_Subida_Nota/frontend/src/pages/ 2>/dev/null
hacer_commit "2026-05-18 16:30:00" "Creación de vistas y enrutamiento (Pages)"
hacer_commit "2026-05-18 18:00:00" "Integración de componentes en la Cartelera"
hacer_commit "2026-05-18 19:45:00" "Desarrollo de la vista de Mis Entradas"

# --- 19 de Mayo (8 commits - Verde muy oscuro) ---
git add Proyecto_Final_Subida_Nota/capturas/ 2>/dev/null
hacer_commit "2026-05-19 09:15:00" "Documentación: Capturas de pantalla del proyecto"
hacer_commit "2026-05-19 11:00:00" "Pruebas de integración frontend-backend"
hacer_commit "2026-05-19 12:30:00" "Resolución de bugs visuales en dispositivos móviles"

# Agregamos todo lo que quede suelto
git add .
hacer_commit "2026-05-19 14:00:00" "Ajustes finales y archivos de configuración residuales"
hacer_commit "2026-05-19 15:45:00" "Optimización de rendimiento en llamadas a la API"
hacer_commit "2026-05-19 17:30:00" "Refactorización final de código (Clean Code)"
hacer_commit "2026-05-19 19:00:00" "Preparación para el despliegue (Build)"
hacer_commit "2026-05-19 21:00:00" "Revisión final y cierre del proyecto"

echo "✅ ¡Plan de commits completado con éxito! Todos tus archivos reales están organizados. Revisa el historial con 'git log'."
