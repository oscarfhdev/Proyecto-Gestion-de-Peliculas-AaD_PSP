# 🎬 OFH CINEMA - Tu cine en casa

<div align="center">
  <h3>Sistema Completo de Gestión de Cines (Full-Stack)</h3>
  <p>Una aplicación moderna y dinámica para la gestión de cines, reserva de butacas y visualización de cartelera, construida con Spring Boot y React.</p>
</div>

---

## 📖 Acerca del Proyecto

**OFH CINEMA** es una solución integral (Full-Stack) desarrollada como proyecto final para gestionar todos los aspectos de un cine moderno. Inspirado en el diseño y la experiencia de usuario de plataformas como Netflix, este sistema permite a los usuarios explorar la cartelera, ver detalles de las películas, seleccionar sus butacas en diferentes tipos de salas (IMAX, VIP, 4DX) y gestionar sus entradas, todo bajo un robusto sistema de seguridad basado en roles.

## ✨ Características Principales

*   **🍿 Cartelera Dinámica:** Exploración de películas en cartelera con datos enriquecidos obtenidos automáticamente a través de la **API de TMDB** (pósters, tráilers, reparto, clasificaciones por edades).
*   **🎟️ Reserva de Entradas y Butacas:** Interfaz visual para la selección interactiva de butacas y compra de entradas.
*   **🔐 Seguridad y RBAC:** Autenticación y autorización implementadas con **JSON Web Tokens (JWT)** y Control de Acceso Basado en Roles (Roles de Administrador y Usuario).
*   **🧑‍💻 Panel de Usuario (Mis Entradas):** Sección dedicada para que los usuarios puedan visualizar su historial de reservas y entradas futuras.
*   **⚙️ Carga de Datos Masiva:** `DataLoader` integrado en el backend para poblar automáticamente la base de datos con películas, salas complejas (miles de butacas) y sesiones programadas.
*   **📱 Diseño Responsivo y Premium:** Interfaz de usuario moderna, atractiva y adaptada a múltiples dispositivos.

---

## 🛠️ Tecnologías Utilizadas

### 💻 Frontend (React SPA)
*   **React 19** + **Vite**
*   **Tailwind CSS v4** (Estilos y diseño responsivo)
*   **Ant Design (antd)** (Componentes UI)
*   **React Router v7** (Enrutamiento)
*   **Axios** (Peticiones HTTP e interceptores)
*   **Recharts** (Visualización de datos/gráficos)

### ⚙️ Backend (Spring Boot)
*   **Java 21** + **Spring Boot 3.4.4**
*   **Spring Security & JWT** (Autenticación y Autorización)
*   **Spring Data JPA** (Persistencia y ORM)
*   **MapStruct & Lombok** (Mapeo de DTOs y reducción de boilerplate)
*   **PostgreSQL / Relacional** (Base de datos principal)

---

## 🏗️ Arquitectura y Seguridad

El proyecto sigue una arquitectura cliente-servidor claramente separada:
1.  **Frontend:** Se comunica exclusivamente a través de la API RESTful. Implementa interceptores de Axios para inyectar automáticamente los tokens JWT en peticiones protegidas.
2.  **Backend:** Proporciona endpoints securizados. Verifica la validez del token y los roles del usuario (`ROLE_USER`, `ROLE_ADMIN`) antes de permitir acciones como la compra de entradas o la modificación del catálogo.
3.  **Seguridad:** Endpoints públicos para consultar la cartelera y endpoints privados para el flujo de compras y administración.

---

## 🚀 Guía de Inicio Rápidos

### Prerrequisitos
*   **Node.js** (v18 o superior) y **npm**
*   **Java 21** (JDK)
*   **Maven**
*   **PostgreSQL** (o base de datos configurada en el `application.properties` / `.env`)
*   Clave API de **TMDB**

### Instalación y Ejecución

#### 1. Configurar y lanzar el Backend
```bash
cd backend
# Configura las variables de entorno o application.properties
./mvnw spring-boot:run
```

#### 2. Configurar y lanzar el Frontend
```bash
cd frontend
npm install
# Configura tu archivo .env.local si es necesario
npm run dev
```

El frontend estará disponible en `http://localhost:5173` y la API backend en `http://localhost:8080`.

---

## 📬 Contacto y Autores

Desarrollado como Proyecto Final (Subida de Nota).
* **Autor:** Óscar
