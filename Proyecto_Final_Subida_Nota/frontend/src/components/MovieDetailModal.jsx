import { useState, useEffect } from 'react';
import { Modal, Button, Rate, Tag, Avatar, Divider, Spin } from 'antd';
import {
    HeartFilled,
    HeartOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    PlayCircleOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getMovieDetails, searchMovies } from '../api/tmdb';

/**
 * Modal de detalle de película estilo Netflix.
 * - Si la peli viene de TMDB (tiene tmdbId numérico): carga detalles enriquecidos de la API.
 * - Si la peli viene del backend (tmdbId empieza por 'backend-' o no tiene): busca en TMDB por título
 *   para enriquecer la vista con cast, trailer, valoración, etc.
 */
const MovieDetailModal = ({ visible, onCancel, pelicula, funciones = [], onAddToCart, isInCart }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible || !pelicula) {
            setDetails(null);
            return;
        }

        const isBackendMovie = !pelicula.tmdbId || String(pelicula.tmdbId).startsWith('backend-');

        if (!isBackendMovie) {
            // Película pura de TMDB → cargar detalles directamente por ID
            setLoading(true);
            getMovieDetails(pelicula.tmdbId)
                .then(data => setDetails(data))
                .catch(() => setDetails(null))
                .finally(() => setLoading(false));
        } else {
            // Película del backend → buscar en TMDB por título para enriquecer la vista
            setLoading(true);
            searchMovies(pelicula.titulo)
                .then(async (results) => {
                    if (results.length > 0) {
                        // Usar el primer resultado (mejor coincidencia)
                        const match = results[0];
                        const tmdbDetails = await getMovieDetails(match.tmdbId);
                        setDetails(tmdbDetails);
                    } else {
                        setDetails(null);
                    }
                })
                .catch(() => setDetails(null))
                .finally(() => setLoading(false));
        }
    }, [visible, pelicula]);

    if (!pelicula) return null;

    // Si tenemos detalles de TMDB usarlos, si no, usar los datos del backend
    const info = details || pelicula;

    // Resolver campos con fallbacks entre TMDB y backend
    const posterSrc = info.posterUrl || info.imagenUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400';
    const titulo = info.titulo || 'Sin título';
    const sinopsis = info.sinopsis || 'Sin sinopsis disponible';
    const duracion = info.duracion || 0;
    const genero = info.genero || null;
    const director = details?.director || pelicula?.directorNombre || null;
    const valoracion = info.valoracion || 0;
    const votos = info.votos || null;
    const año = info.fechaEstreno ? dayjs(info.fechaEstreno).format('YYYY') : null;
    const edadMinima = pelicula?.edadMinima || details?.edadMinima || null;

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={950}
            centered
            destroyOnHidden
            closeIcon={<span className="text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-colors">✕</span>}
            styles={{
                content: { padding: 0, backgroundColor: '#181818', borderRadius: 12, overflow: 'hidden', border: '1px solid #333' },
                body: { padding: 0 },
                mask: { backdropFilter: 'blur(5px)' }
            }}
        >
            <div className="flex flex-col md:flex-row h-[620px]">
                {/* Póster */}
                <div className="w-full md:w-[40%] h-full relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#181818] z-10" />
                    <img
                        src={posterSrc}
                        alt={titulo}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Información */}
                <div className="flex-1 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-20 -ml-12 md:ml-0">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center"><Spin size="large" /></div>
                    ) : (
                        <>
                            {/* Título y metadata */}
                            <div className="mb-4">
                                <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{titulo}</h1>
                                <div className="flex items-center gap-3 text-gray-400 text-sm font-medium flex-wrap">
                                    {año && (
                                        <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">{año}</span>
                                    )}
                                    {edadMinima != null && edadMinima > 0 && (
                                        <span className="px-2 py-0.5 border border-yellow-700 rounded text-xs text-yellow-500">+{edadMinima}</span>
                                    )}
                                    {duracion > 0 && (
                                        <span>{Math.floor(duracion / 60)}h {duracion % 60}m</span>
                                    )}
                                    {genero && <Tag color="red" className="m-0">{genero}</Tag>}
                                </div>
                            </div>

                            {/* Valoración — solo si hay datos reales */}
                            {valoracion > 0 && (
                                <div className="flex items-center gap-3 mb-6">
                                    <Rate allowHalf disabled value={valoracion / 2} style={{ color: '#E50914' }} />
                                    <span className="text-white font-bold text-lg">{valoracion}</span>
                                    <span className="text-gray-500 text-sm ml-1">/ 10</span>
                                    {votos && <span className="text-gray-600 text-xs">({votos.toLocaleString()} votos)</span>}
                                </div>
                            )}

                            {/* Sinopsis */}
                            <div className="mb-6">
                                <h3 className="text-white font-bold mb-2">Sinopsis</h3>
                                <p className="text-gray-300 leading-relaxed text-sm">{sinopsis}</p>
                            </div>

                            {/* Géneros (TMDB provee múltiples) */}
                            {details?.generos?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {details.generos.map(g => (
                                        <Tag key={g} bordered={false} className="bg-zinc-800 text-gray-300 m-0 px-3 py-1">{g}</Tag>
                                    ))}
                                </div>
                            )}

                            {/* Cast (solo disponible desde TMDB) */}
                            {details?.cast?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-white font-bold mb-3">Reparto</h3>
                                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                                        {details.cast.map((actor, i) => (
                                            <div key={i} className="shrink-0 text-center w-16">
                                                <Avatar
                                                    size={56}
                                                    src={actor.foto}
                                                    icon={!actor.foto && <UserOutlined />}
                                                    className="mb-1 border-2 border-zinc-700"
                                                />
                                                <p className="text-gray-300 text-[10px] leading-tight font-medium">{actor.nombre}</p>
                                                <p className="text-gray-600 text-[9px] leading-tight truncate">{actor.personaje}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trailer (solo disponible desde TMDB) */}
                            {details?.trailerKey && (
                                <div className="mb-6">
                                    <Button
                                        icon={<PlayCircleOutlined />}
                                        size="large"
                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${details.trailerKey}`, '_blank')}
                                        style={{ backgroundColor: '#E50914', color: 'white', border: 'none', fontWeight: 'bold' }}
                                    >
                                        Ver Trailer
                                    </Button>
                                </div>
                            )}

                            <Divider className="bg-zinc-800 my-4 border-zinc-800" />

                            {/* Sesiones disponibles para esta película */}
                            {funciones.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                        <span className="text-lg">🎬</span> Sesiones Disponibles en Nuestro Cine
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {funciones.map(f => (
                                            <button
                                                key={f.id}
                                                onClick={() => onAddToCart && onAddToCart(f)}
                                                className={`${isInCart && isInCart(f.id) 
                                                    ? 'bg-green-900/40 border-green-600' 
                                                    : 'bg-zinc-800 border-zinc-700 hover:bg-red-600 hover:border-red-500'
                                                } transition-all duration-200 rounded-xl px-5 py-3 text-center group border hover:scale-105`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ClockCircleOutlined className="text-red-500 group-hover:text-white" />
                                                    <span className="text-white font-bold text-lg">
                                                        {dayjs(f.fechaHora).format('HH:mm')}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 group-hover:text-gray-200 mt-1">
                                                    {dayjs(f.fechaHora).format('DD/MM')} • {f.salaNombre} • {f.precio?.toFixed(2)}€
                                                </div>
                                                {isInCart && isInCart(f.id) && (
                                                    <Tag color="green" className="mt-1 text-[10px]">✓ En carrito</Tag>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Director */}
                            {director && (
                                <div className="mt-auto pt-4 border-t border-zinc-800/50 text-xs text-gray-600">
                                    <p><span className="font-bold text-gray-500">Dirección:</span> {director}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default MovieDetailModal;
