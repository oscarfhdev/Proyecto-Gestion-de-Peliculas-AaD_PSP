import axios from 'axios';

// API Key de TMDB desde variables de entorno
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

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
 * Obtiene las películas en cartelera actual de TMDB
 */
export const getNowPlaying = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: { api_key: API_KEY, language: 'es-ES', page: 1, region: 'ES' }
    });
    return response.data.results.map(formatMovie);
  } catch (error) {
    console.error('Error TMDB now_playing:', error);
    return [];
  }
};

/**
 * Obtiene las películas populares de TMDB
 */
export const getPopular = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: { api_key: API_KEY, language: 'es-ES', page: 1 }
    });
    return response.data.results.map(formatMovie);
  } catch (error) {
    console.error('Error TMDB popular:', error);
    return [];
  }
};

/**
 * Obtiene las películas mejor valoradas de TMDB
 */
export const getTopRated = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: { api_key: API_KEY, language: 'es-ES', page: 1 }
    });
    return response.data.results.map(formatMovie);
  } catch (error) {
    console.error('Error TMDB top_rated:', error);
    return [];
  }
};

/**
 * Obtiene los próximos estrenos de TMDB
 */
export const getUpcoming = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: { api_key: API_KEY, language: 'es-ES', page: 1, region: 'ES' }
    });
    return response.data.results.map(formatMovie);
  } catch (error) {
    console.error('Error TMDB upcoming:', error);
    return [];
  }
};

/**
 * Busca películas en TMDB por nombre
 */
export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query, language: 'es-ES', include_adult: false }
    });
    return response.data.results.map(formatMovie);
  } catch (error) {
    console.error('Error TMDB search:', error);
    return [];
  }
};

/**
 * Obtiene detalles completos de una película de TMDB
 */
export const getMovieDetails = async (tmdbId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
      params: { api_key: API_KEY, language: 'es-ES', append_to_response: 'credits,videos,release_dates' }
    });
    const movie = response.data;
    const credits = movie.credits;
    const director = credits?.crew?.find(p => p.job === 'Director');
    const cast = credits?.cast?.slice(0, 8) || [];
    const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    // Extraer certificación de edad: primero España (ES), luego USA (US), luego cualquiera
    let edadMinima = null;
    const releaseDates = movie.release_dates?.results || [];
    const esRelease = releaseDates.find(r => r.iso_3166_1 === 'ES');
    const usRelease = releaseDates.find(r => r.iso_3166_1 === 'US');
    const anyRelease = releaseDates.find(r => r.release_dates?.some(rd => rd.certification));
    const targetRelease = esRelease || usRelease || anyRelease;
    if (targetRelease) {
      const cert = targetRelease.release_dates?.find(rd => rd.certification)?.certification;
      if (cert) {
        // Convertir certificación textual a numérica (ej: "PG-13" → 13, "R" → 17, "12" → 12)
        const numMatch = cert.match(/\d+/);
        if (numMatch) edadMinima = parseInt(numMatch[0], 10);
        else if (cert === 'R' || cert === 'NC-17') edadMinima = 17;
        else if (cert === 'PG') edadMinima = 7;
        else if (cert === 'G' || cert === 'TP' || cert === 'T') edadMinima = 0;
      }
    }

    return {
      ...formatMovie(movie),
      sinopsis: movie.overview || 'Sin sinopsis disponible',
      duracion: movie.runtime || 0,
      director: director ? director.name : 'Desconocido',
      directorFoto: director?.profile_path ? `${IMAGE_BASE_URL}/w185${director.profile_path}` : null,
      cast: cast.map(a => ({
        nombre: a.name,
        personaje: a.character,
        foto: a.profile_path ? `${IMAGE_BASE_URL}/w185${a.profile_path}` : null,
      })),
      generos: movie.genres?.map(g => GENRE_MAP[g.id] || g.name) || [],
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      trailerKey: trailer?.key || null,
      valoracion: Math.round(movie.vote_average * 10) / 10,
      votos: movie.vote_count,
      edadMinima,
    };
  } catch (error) {
    console.error('Error TMDB details:', error);
    return null;
  }
};

/**
 * Formatea una película de la lista de TMDB
 */
const formatMovie = (movie) => ({
  tmdbId: movie.id,
  titulo: movie.title,
  sinopsis: movie.overview,
  posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : null,
  backdropUrl: movie.backdrop_path ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}` : null,
  fechaEstreno: movie.release_date,
  valoracion: Math.round(movie.vote_average * 10) / 10,
  generoIds: movie.genre_ids || [],
  genero: movie.genre_ids?.[0] ? (GENRE_MAP[movie.genre_ids[0]] || 'Película') : 'Película',
});

export const getImageUrl = (path, size = 'w500') => 
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
