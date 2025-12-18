import React, { useState, useEffect } from 'react';
import { Modal, Button, Rate, Tag, Avatar, Divider, message } from 'antd';
import {
    HeartFilled,
    HeartOutlined,
    GlobalOutlined,
    VideoCameraOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const MovieDetailModal = ({ visible, onCancel, pelicula, isFavorito, toggleFavorito }) => {
    const [criticas, setCriticas] = useState([]);
    const [funcionesCine, setFuncionesCine] = useState([]);

    // Cargar datos al abrir modal
    useEffect(() => {
        if (visible && pelicula) {
            cargarCriticas(pelicula.titulo);
            cargarFunciones(pelicula.titulo);
        } else {
            setCriticas([]);
            setFuncionesCine([]);
        }
    }, [visible, pelicula]);

    const cargarCriticas = async (titulo) => {
        try {
            const response = await axios.get(`${API_URL}/criticas`);
            // Filtrar por título (case insensitive)
            const filtradas = response.data.filter(c =>
                c.peliculaTitulo.toLowerCase() === titulo.toLowerCase()
            );
            setCriticas(filtradas);
        } catch (error) {
            console.error('Error cargando críticas');
        }
    };

    const cargarFunciones = async (titulo) => {
        try {
            const response = await axios.get(`${API_URL}/funciones`);
            // Filtrar las funciones que correspondan a esta película
            const disponibles = response.data.filter(f =>
                f.peliculaTitulo.toLowerCase() === titulo.toLowerCase()
            );
            setFuncionesCine(disponibles);
        } catch (error) {
            console.error('Error cargando funciones');
        }
    };

    if (!pelicula) return null;

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
            <div className="flex flex-col md:flex-row h-[600px]">
                {/* Póster */}
                <div className="w-full md:w-[40%] h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#181818] z-10" />
                    <img
                        src={pelicula.posterUrl || 'https://via.placeholder.com/300x450?text=Sin+Imagen'}
                        alt={pelicula.titulo}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Información Columna Derecha */}
                <div className="flex-1 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-20 -ml-12 md:ml-0">
                    <div className="mb-4">
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                            {pelicula.titulo}
                        </h1>
                        <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                            <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">{pelicula.clasificacion || '16+'}</span>
                            <span>{dayjs(pelicula.fechaEstreno).format('YYYY')}</span>
                            <span>{Math.floor(pelicula.duracion / 60)}h {pelicula.duracion % 60}m</span>
                        </div>
                    </div>

                    {/* Valoración Estrellas */}
                    <div className="flex items-center gap-3 mb-6">
                        <Rate allowHalf disabled value={pelicula.valoracion || 0} style={{ color: '#E50914' }} />
                        <span className="text-white font-bold text-lg">{pelicula.valoracion ? pelicula.valoracion.toFixed(1) : '0'}</span>
                        <span className="text-gray-500 text-sm ml-1">/ 5</span>
                    </div>

                    {/* Botones Acción */}
                    <div className="flex gap-3 mb-8">
                        <Button
                            block
                            type="default"
                            icon={isFavorito && isFavorito(pelicula.id) ? <HeartFilled /> : <HeartOutlined />}
                            size="large"
                            onClick={() => toggleFavorito && toggleFavorito(pelicula)}
                            className={`font-semibold h-12 transition-all ${isFavorito && isFavorito(pelicula.id) ? 'bg-red-600 border-red-600 text-white hover:bg-red-700' : 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700'}`}
                        >
                            {isFavorito && isFavorito(pelicula.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        </Button>
                    </div>

                    {/* Sinopsis */}
                    <div className="mb-8">
                        <h3 className="text-white font-bold mb-2">Sinopsis</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
                            {pelicula.sinopsis}
                        </p>
                    </div>

                    {/* Info Extra: Idiomas y Plataformas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h4 className="text-gray-500 font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider"><GlobalOutlined /> Audio Disponibles</h4>
                            <div className="flex flex-wrap gap-2">
                                {pelicula.idiomas && pelicula.idiomas.length > 0 ? (
                                    pelicula.idiomas.map(idioma => (
                                        <Tag key={idioma.id} bordered={false} className="bg-zinc-800 text-gray-300 m-0 px-3 py-1">{idioma.nombre}</Tag>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm italic">No especificado</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider"><VideoCameraOutlined /> Dónde ver</h4>
                            <div className="flex flex-wrap gap-3 items-center">
                                {/* Plataformas desde la BBDD */}
                                {pelicula.plataformas && pelicula.plataformas.length > 0 ? (
                                    pelicula.plataformas.map(plataforma => (
                                        <div key={plataforma.id} className="bg-white rounded-lg h-14 w-14 flex items-center justify-center p-1.5 overflow-hidden shadow-md" title={plataforma.nombre}>
                                            {plataforma.url ? (
                                                <img src={plataforma.url} alt={plataforma.nombre} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-[10px] text-gray-800 font-bold text-center leading-tight">{plataforma.nombre}</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm italic">No disponible en streaming</span>
                                )}
                                {/* Indicador dinámico de Cines */}
                                {funcionesCine.length > 0 && (
                                    <div className="h-8 flex items-center gap-1.5 px-3 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-md animate-pulse">
                                        <span className="text-lg">🎬</span>
                                        <span className="text-xs text-white font-bold">¡En Cartelera!</span>
                                    </div>
                                )}
                            </div>
                            {funcionesCine.length > 0 && (
                                <a href="#" className="text-xs text-red-400 hover:underline mt-2 inline-block">Ver horarios y salas →</a>
                            )}
                        </div>
                    </div>

                    <Divider className="bg-zinc-800 my-6 border-zinc-800" />

                    {/* Valoraciones de usuarios */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Valoraciones de la comunidad</h3>
                        {criticas.length > 0 ? (
                            <div className="space-y-4">
                                {criticas.map((critica) => (
                                    <div key={critica.id} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: '#87d068' }} />
                                                <span className="text-gray-300 font-bold text-sm">{critica.autor || 'Anónimo'}</span>
                                            </div>
                                            <Rate disabled value={critica.nota ? critica.nota / 2 : 0} style={{ fontSize: 12, color: '#E50914' }} />
                                        </div>
                                        <p className="text-gray-400 text-xs leading-relaxed">"{critica.comentario}"</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">No hay reseñas todavía.</p>
                        )}
                    </div>

                    {/* Créditos footer */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/50 text-xs text-gray-600">
                        <p className="mb-1">
                            <span className="font-bold text-gray-500">Dirección:</span> {pelicula.director?.nombreCompleto || `${pelicula.director?.nombre} ${pelicula.director?.apellido}`}
                        </p>
                        <p>
                            <span className="font-bold text-gray-500">Reparto:</span> {pelicula.actores?.map(a => a.nombreCompleto || a.nombre).slice(0, 5).join(', ')}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #777;
                }
            `}</style>
        </Modal>
    );
};

export default MovieDetailModal;
