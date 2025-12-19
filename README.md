<div align="center">

  <img src="Frontend React - TailwindCSS/src/assets/logo.png" alt="OFHCINEMA Logo" width="200" />
  
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
* **Carga de Datos Masiva (DataLoader):** Inicialización automática de la base de datos con películas reales (Oppenheimer, Avengers, etc.) basada en archivos CSV y relaciones complejas.
* **Generación de Datos Aleatoria:** Simulación de críticas, idiomas y plataformas para dar vida a la aplicación.

### 🎨 Frontend Inmersivo (React + Ant Design)
* **Diseño "Netflix Dark Mode":** Interfaz oscura, elegante y totalmente responsive.
* **Panel de Administración:** Tablas de datos avanzadas, modales de edición y buscador integrado con la API de TMDB para auto-completar formularios.
* **Experiencia de Usuario:** Login con detección de roles, notificaciones toast, y modales de detalles interactivos.

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Lenguaje:** Java 17+
* **Framework:** Spring Boot (Web, Data JPA)
* **Base de Datos:** H2 (En memoria para desarrollo) / MySQL compatible.
* **Herramientas:** Maven, Lombok.

### Frontend
* **Framework:** React (Vite).
* **UI Library:** Ant Design (antd).
* **Estilos:** CSS Modules / Tailwind CSS.
* **HTTP Client:** Axios.

---
