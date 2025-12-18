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

    // Obtener los 5 primeros actores del cast
    const actoresNombres = credits.cast
      .slice(0, 5)
      .map(actor => actor.name);

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
      actoresNombres,
      categoriasNombres,
      plataformasNombres: ['Cine'] // Default
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
