<div align="center">

  <img src="Frontend React - TailwindCSS/src/assets/logo.png" alt="OFHCINEMA Logo" width="400" />

 
  **Plataforma de Gestión de Cine Full-Stack**

  [![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)](https://www.oracle.com/java/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-green?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Ant Design](https://img.shields.io/badge/Ant_Design-5.0-red?style=for-the-badge&logo=ant-design)](https://ant.design/)

</div>

<br />

## 📋 Descripción del Proyecto

**OFHCINEMA** es una aplicación web moderna diseñada para la gestión integral de un cine. Combina un **Backend robusto en Spring Boot** con un **Frontend dinámico en React**, ofreciendo una experiencia de usuario fluida estilo "Netflix".

El sistema permite a los administradores gestionar el catálogo de películas con herramientas automatizadas y a los clientes disfrutar de una cartelera interactiva.

---

## ✨ Características Principales

### 🚀 Backend Inteligente (Spring Boot)
* **Integración con API Externa (TMDB):** El sistema se conecta automáticamente con *The Movie Database* para importar datos, pósters y sinopsis.
* **Gestión Inteligente de Entidades:** Al crear una película, el backend detecta si los Directores o Actores existen; si no, los crea dinámicamente.
* **Carga de Datos Simple al Iniciar):** Inicialización automática de la de datos.
* **Generación de Datos Aleatoria:** Simulación de críticas, idiomas y plataformas para dar vida a la aplicación.

### 🎨 Frontend Inmersivo (React + Ant Design)
* **Diseño "Netflix Dark Mode":** Interfaz oscura, elegante y totalmente responsive.
* **Panel de Administración:** Tablas de datos avanzadas, modales de edición y buscador integrado con la API de TMDB para auto-completar formularios.
* **Experiencia de Usuario:** Login con detección de roles, notificaciones toast, y modales de detalles interactivos.

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Lenguaje:** Java 21
* **Framework:** Spring Boot (Web, Data JPA)
* **Base de Datos:** MySQL .
* **Herramientas:** Maven, Lombok.

### Frontend
* **Framework:** React (Vite).
* **UI Library:** Ant Design (antd).
* **Estilos:** CSS Modules / Tailwind CSS.
* **HTTP Client:** Axios.

---

## 📸 Capturas de Pantalla

| Panel de Administración | Cartelera de Cliente |
|:-----------------------:|:--------------------:|
| ![Admin](screenshots/admin.png) | ![Cartelera](screenshots/cartelera.png) |

| Login | Modal de Detalles |
|:-----:|:-----------------:|
| ![Login](screenshots/login.png) | ![Modal](screenshots/modal.png) |

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1️⃣ Prerrequisitos
* Java JDK 21 o superior.
* Node.js y npm.
* Maven.

### 2️⃣ Levantar el Backend (Puerto 8081)
```bash
cd Backend\ Spring\ Boot
./mvnw spring-boot:run

```

*El backend iniciará el `DataLoader`, importando automáticamente datos.*

### 3️⃣ Levantar el Frontend (Puerto 5173)

```bash
cd frontend-cine
npm install
npm run dev

```

---

## 🔐 Credenciales de Prueba

Para acceder a la aplicación puedes usar los siguientes usuarios pre-generados:

| Rol | Usuario | Contraseña | Acceso |
| --- | --- | --- | --- |
| **Administrador** | `admin` | `admin123` | Gestión total (CRUD Películas) |
| **Cliente** | `usuario` | `usuario` | Visualización y Favoritos |

---

## 📡 Estructura del Proyecto

```text
OFHCINEMA/
├── Backend Spring Boot/      # Servidor API REST
│   ├── src/main/java/        # Código fuente Java
│   ├── src/main/resources/   # Configuración y CSVs de datos
│   └── pom.xml               # Dependencias Maven
│
└── Frontend React - TailwindCSS//            # Cliente React
    ├── src/components/       # Componentes reutilizables
    ├── src/pages/            # Vistas (Login, Admin, Cartelera)
    ├── src/services/         # Conexión con Backend y TMDB
    └── package.json          # Dependencias NPM

```

---

<div align="center">
<p>Desarrollado con ❤️ para la asignatura de AaD y PSP</p>
<p>&copy; 2025 OFHCINEMA</p>
</div>

