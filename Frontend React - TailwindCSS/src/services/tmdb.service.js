import axios from 'axios';

// API Key de TMDB desde variables de entorno
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Mapa de géneros de TMDB a español
 */
const GENRE_MAP = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familia',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia Ficción',
  10770: 'Película de TV',
  53: 'Suspense',
  10752: 'Bélica',
  37: 'Western'
};

/**
 * Busca películas en TMDB por nombre
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de películas encontradas
 */
export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
        language: 'es-ES',
        include_adult: false
      }
    });

    return response.data.results.map(movie => ({
      id: movie.id,
      titulo: movie.title,
      posterUrl: movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : null,
      fechaEstreno: movie.release_date || null,
      anio: movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
    }));
  } catch (error) {
    console.error('Error buscando en TMDB:', error);
    throw error;
  }
};

/**
 * Obtiene detalles completos de una película de TMDB
 * Formatea los datos exactamente como los espera el backend
 * @param {number} tmdbId - ID de la película en TMDB
 * @returns {Promise<Object>} Datos formateados para el backend
 */
export const getMovieDetails = async (tmdbId) => {
  try {
    // Obtener detalles de la película + créditos en una sola llamada
    const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
        append_to_response: 'credits'
      }
    });

    const movie = response.data;
    const credits = movie.credits;

    // Buscar el director en el crew
    const director = credits.crew.find(person => person.job === 'Director');
    const directorNombre = director ? director.name : 'Desconocido';
    const directorFotoUrl = director && director.profile_path 
      ? `${IMAGE_BASE_URL}${director.profile_path}` 
      : '';

    // Obtener los 5 primeros actores del cast con fotos
    const actoresData = credits.cast
      .slice(0, 5)
      .map(actor => {
        const nameParts = actor.name.split(' ');
        const nombre = nameParts[0];
        const apellido = nameParts.slice(1).join(' ');
        return {
          nombre,
          apellido,
          nombreCompleto: actor.name,
          fotoUrl: actor.profile_path 
            ? `${IMAGE_BASE_URL}${actor.profile_path}` 
            : ''
        };
      });
    
    // Para compatibilidad, también enviar solo nombres
    const actoresNombres = actoresData.map(a => a.nombreCompleto);

    // Convertir géneros de TMDB a español
    const categoriasNombres = movie.genres.map(genre => 
      GENRE_MAP[genre.id] || genre.name
    );

    // Convertir valoración de TMDB (0-10) a escala 1-5
    const valoracion = Math.round(movie.vote_average / 2);

    return {
      titulo: movie.title,
      sinopsis: movie.overview || 'Sin sinopsis disponible',
      fechaEstreno: movie.release_date,
      duracion: movie.runtime || 120,
      posterUrl: movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : '',
      valoracion: Math.max(1, Math.min(5, valoracion)), // Asegurar rango 1-5
      directorNombre,
      directorFotoUrl,
      actoresNombres,
      actoresData, // Nueva propiedad con fotos
      categoriasNombres,
      plataformasNombres: [] // Se generan automáticamente en el backend
    };
  } catch (error) {
    console.error('Error obteniendo detalles de TMDB:', error);
    throw error;
  }
};

export default {
  searchMovies,
  getMovieDetails
};

/**
 * Busca personas (directores) en TMDB
 * @param {string} query - Nombre a buscar
 * @returns {Promise<Array>} Lista de personas encontradas
 */
export const searchPeople = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/person`, {
      params: {
        api_key: API_KEY,
        query,
        language: 'es-ES',
        include_adult: false
      }
    });

    return response.data.results
      .filter(person => person.known_for_department === 'Directing')
      .slice(0, 10)
      .map(person => {
        const nameParts = person.name.split(' ');
        const nombre = nameParts[0];
        const apellido = nameParts.slice(1).join(' ');
        
        return {
          id: person.id,
          nombre,
          apellido,
          nombreCompleto: person.name,
          fotoUrl: person.profile_path 
            ? `${IMAGE_BASE_URL}${person.profile_path}` 
            : null,
          department: person.known_for_department
        };
      });
  } catch (error) {
    console.error('Error buscando personas en TMDB:', error);
    throw error;
  }
};

/**
 * Busca actores en TMDB
 * @param {string} query - Nombre a buscar
 * @returns {Promise<Array>} Lista de actores encontrados
 */
export const searchActors = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/person`, {
      params: {
        api_key: API_KEY,
        query,
        language: 'es-ES',
        include_adult: false
      }
    });

    return response.data.results
      .filter(person => person.known_for_department === 'Acting')
      .slice(0, 10)
      .map(person => {
        const nameParts = person.name.split(' ');
        const nombre = nameParts[0];
        const apellido = nameParts.slice(1).join(' ');
        
        return {
          id: person.id,
          nombre,
          apellido,
          nombreCompleto: person.name,
          fotoUrl: person.profile_path 
            ? `${IMAGE_BASE_URL}${person.profile_path}` 
            : null,
          department: person.known_for_department
        };
      });
  } catch (error) {
    console.error('Error buscando actores en TMDB:', error);
    throw error;
  }
};

/**
 * Obtiene detalles de una persona de TMDB
 * @param {number} personId - ID de la persona en TMDB
 * @returns {Promise<Object>} Datos de la persona
 */
export const getPersonDetails = async (personId) => {
  try {
    const response = await axios.get(`${BASE_URL}/person/${personId}`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES'
      }
    });

    const person = response.data;
    const nameParts = person.name.split(' ');
    const nombre = nameParts[0];
    const apellido = nameParts.slice(1).join(' ');

    return {
      nombre,
      apellido,
      nombreCompleto: person.name,
      fotoUrl: person.profile_path 
        ? `${IMAGE_BASE_URL}${person.profile_path}` 
        : null,
      biografia: person.biography || '',
      fechaNacimiento: person.birthday,
      lugarNacimiento: person.place_of_birth
    };
  } catch (error) {
    console.error('Error obteniendo detalles de persona en TMDB:', error);
    throw error;
  }
};
