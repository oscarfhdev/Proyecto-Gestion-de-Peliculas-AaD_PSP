import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    Button,
    Tag,
    Rate,
    Spin,
    ConfigProvider,
    theme,
    message,
    Avatar,
    Divider
} from 'antd';
import {
    PlayCircleOutlined,
    LogoutOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    StarFilled,
    PlusOutlined,
    LeftOutlined,
    RightOutlined,
    InfoCircleOutlined,
    DesktopOutlined,
    GlobalOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import logo from '../assets/logo.png';

const API_URL = 'http://localhost:8081/api';

const CarteleraPage = () => {
    const navigate = useNavigate();
    const [peliculas, setPeliculas] = useState([]);
    const [destacadas, setDestacadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroMovies, setHeroMovies] = useState([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPelicula, setSelectedPelicula] = useState(null);
    const [user, setUser] = useState(null);
    const [criticas, setCriticas] = useState([]);
    const [funcionesCine, setFuncionesCine] = useState([]);
    const [modal, modalContextHolder] = Modal.useModal();

    // Tema oscuro Netflix
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: '#E50914',
            colorBgContainer: '#1a1a1a',
            colorBgElevated: '#1f1f1f',
            borderRadius: 8,
        },
    };

    // Verificar autenticación
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userJson));
        cargarPeliculas();
    }, [navigate]);

    // Rotación automática del Hero
    useEffect(() => {
        if (heroMovies.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
        }, 7000); // Cambio cada 7 segundos
        return () => clearInterval(interval);
    }, [heroMovies]);

    // Cargar películas
    const cargarPeliculas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/peliculas`);
            const data = response.data;
            setPeliculas(data);

            // Lógica aleatoria: 3 Hero + 10 Destacadas
            if (data.length > 0) {
                const shuffled = [...data].sort(() => 0.5 - Math.random());
                setHeroMovies(shuffled.slice(0, 3));
                setDestacadas(shuffled.slice(3, 13));
            }
        } catch (error) {
            message.error('Error al cargar películas');
        } finally {
            setLoading(false);
        }
    };

    // Cargar críticas al abrir detalle
    useEffect(() => {
        if (selectedPelicula) {
            // Cargar críticas
            const fetchCriticas = async () => {
                try {
                    const response = await axios.get(`${API_URL}/criticas`);
                    const filtered = response.data.filter(c => c.peliculaTitulo === selectedPelicula.titulo);
                    setCriticas(filtered);
                } catch (error) {
                    console.error("Error cargando críticas", error);
                    setCriticas([]);
                }
            };
            // Cargar funciones de cine
            const fetchFunciones = async () => {
                try {
                    const response = await axios.get(`${API_URL}/funciones`);
                    const filtered = response.data.filter(f => f.pelicula?.titulo === selectedPelicula.titulo);
                    setFuncionesCine(filtered);
                } catch (error) {
                    console.error("Error cargando funciones", error);
                    setFuncionesCine([]);
                }
            };
            fetchCriticas();
            fetchFunciones();
        } else {
            setCriticas([]);
            setFuncionesCine([]);
        }
    }, [selectedPelicula]);

    // Abrir modal de detalles
    const handleVerDetalles = (pelicula) => {
        setSelectedPelicula(pelicula);
        setModalVisible(true);
    };

    // Reproducir película
    const handleReproducir = () => {
        message.success(`Reproduciendo "${selectedPelicula?.titulo}"...`);
        setModalVisible(false);
    };

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Agrupar películas por categoría
    const peliculasPorCategoria = {};
    peliculas.forEach(p => {
        p.categorias?.forEach(c => {
            if (!peliculasPorCategoria[c.nombre]) {
                peliculasPorCategoria[c.nombre] = [];
            }
            peliculasPorCategoria[c.nombre].push(p);
        });
    });

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <ConfigProvider theme={darkTheme}>
            <div
                className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden"
                style={{ backgroundColor: '#0a0a0a' }}
            >
                {modalContextHolder}

                {/* ========== HEADER (Idéntico al Admin) ========== */}
                <header
                    className="flex items-center justify-between px-8 shrink-0"
                    style={{ backgroundColor: '#0a0a0a', height: '72px', borderBottom: '1px solid #1a1a1a' }}
                >
                    {/* Logo y Menú */}
                    <div className="flex items-center gap-6">
                        <img src={logo} alt="OFHCINEMA" className="h-19" />
                        <div className="h-8 w-px bg-gray-800"></div>

                        {/* Navegación */}
                        <div className="flex items-center gap-2 ml-2">
                            <button className="nav-btn">
                                Mejores Películas
                            </button>
                            <span className="text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn">
                                Mis Películas Favoritas
                            </button>
                            <span className="text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn-highlight">
                                Nuestra Cartelera
                            </button>
                        </div>
                    </div>

                    {/* Usuario y Logout */}
                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <span className="text-gray-500 text-xs block">Bienvenido</span>
                            <span className="text-white font-medium">{user?.username}</span>
                        </div>
                        <Button
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            className="logout-btn"
                            style={{
                                backgroundColor: '#2a2a2a',
                                borderColor: '#3a3a3a',
                                color: '#999'
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </div>
                </header>

                {/* ========== CONTENIDO CON SCROLL ========== */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* Hero Section */}
                    {/* Hero Section (Carrusel) */}
                    {heroMovies.length > 0 && (
                        <section
                            className="relative w-full h-[60vh] flex items-end group overflow-hidden"
                            style={{ transition: 'background-image 1s ease-in-out' }}
                        >
                            {/* Background Images (Stacked for Cross-fade) */}
                            {heroMovies.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out group-hover:scale-110 ${index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                    style={{
                                        backgroundImage: `url(${movie.posterUrl})`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
                                </div>
                            ))}

                            {/* Content (Changes with Fade) */}
                            <div className="relative z-10 p-12 max-w-4xl flex flex-col items-start text-left transition-opacity duration-500">
                                <Tag color="red" className="mb-4 text-sm font-bold tracking-wider px-3 py-1">PELÍCULA DESTACADA</Tag>
                                <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-2xl text-white tracking-tight leading-tight">
                                    {heroMovies[currentHeroIndex]?.titulo}
                                </h1>
                                <p className="text-lg text-gray-300 mb-8 line-clamp-3 max-w-2xl drop-shadow-md text-left">
                                    {heroMovies[currentHeroIndex]?.sinopsis}
                                </p>
                                <div className="flex items-center gap-4">
                                    <Button
                                        size="large"
                                        icon={<UserOutlined />}
                                        onClick={() => handleVerDetalles(heroMovies[currentHeroIndex])}
                                        style={{
                                            backgroundColor: '#E50914',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            height: 52,
                                            paddingLeft: 32,
                                            paddingRight: 32,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Más Información
                                    </Button>
                                </div>
                            </div>

                            {/* Indicadores de página (Puntitos) */}
                            <div className="absolute right-12 bottom-12 flex gap-2 z-20">
                                {heroMovies.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentHeroIndex(idx)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'bg-red-600 w-6' : 'bg-gray-500 hover:bg-white'}`}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Sección: Mejores Títulos */}
                    {destacadas.length > 0 && (
                        <MovieRow
                            title="Mejores Títulos"
                            movies={destacadas}
                            icon={<StarFilled className="text-yellow-500" />}
                            onMovieClick={handleVerDetalles}
                        />
                    )}

                    {/* Secciones por Categoría */}
                    <div className="flex flex-col gap-10 mt-24 pb-12">
                        {Object.entries(peliculasPorCategoria).map(([categoria, movies]) => (
                            <MovieRow
                                key={categoria}
                                title={categoria}
                                movies={movies}
                                onMovieClick={handleVerDetalles}
                            />
                        ))}
                    </div>

                    {/* Footer Simple */}
                    <footer className="py-12 text-center text-gray-500 text-sm border-t border-[#1a1a1a] mt-12 bg-[#0a0a0a]">
                        <p>© 2024 OFH CINEMA. Todos los derechos reservados.</p>
                    </footer>
                </div>

                {/* ========== MODAL DE DETALLES ========== */}
                <Modal
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
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
                    {selectedPelicula && (
                        <div className="flex flex-col md:flex-row h-[600px]">
                            {/* Póster */}
                            <div className="w-full md:w-[40%] h-full relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#181818] z-10" />
                                <img
                                    src={selectedPelicula.posterUrl || 'https://via.placeholder.com/300x450?text=Sin+Imagen'}
                                    alt={selectedPelicula.titulo}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Información Columna Derecha */}
                            <div className="flex-1 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar relative z-20 -ml-12 md:ml-0">
                                <div className="mb-4">
                                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                                        {selectedPelicula.titulo}
                                    </h1>
                                    <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                                        <span className="px-2 py-0.5 border border-gray-600 rounded text-xs">{selectedPelicula.clasificacion || '16+'}</span>
                                        <span>{dayjs(selectedPelicula.fechaEstreno).format('YYYY')}</span>
                                        <span>{Math.floor(selectedPelicula.duracion / 60)}h {selectedPelicula.duracion % 60}m</span>
                                    </div>
                                </div>

                                {/* Valoración Estrellas */}
                                <div className="flex items-center gap-3 mb-6">
                                    <Rate allowHalf disabled value={selectedPelicula.valoracion || 0} style={{ color: '#E50914' }} />
                                    <span className="text-white font-bold text-lg">{selectedPelicula.valoracion ? selectedPelicula.valoracion.toFixed(1) : '0'}</span>
                                    <span className="text-gray-500 text-sm ml-1">/ 5</span>
                                </div>

                                {/* Botones Acción */}
                                <div className="flex gap-3 mb-8">
                                    <Button
                                        block
                                        type="default"
                                        icon={<PlusOutlined />}
                                        size="large"
                                        className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white font-semibold h-12"
                                    >
                                        Añadir a mi lista
                                    </Button>
                                </div>

                                {/* Sinopsis */}
                                <div className="mb-8">
                                    <h3 className="text-white font-bold mb-2">Sinopsis</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">
                                        {selectedPelicula.sinopsis}
                                    </p>
                                </div>

                                {/* Info Extra: Idiomas y Plataformas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h4 className="text-gray-500 font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider"><GlobalOutlined /> Audio Disponibles</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPelicula.idiomas && selectedPelicula.idiomas.length > 0 ? (
                                                selectedPelicula.idiomas.map(idioma => (
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
                                            {selectedPelicula.plataformas && selectedPelicula.plataformas.length > 0 ? (
                                                selectedPelicula.plataformas.map(plataforma => (
                                                    <div key={plataforma.id} className="bg-white rounded h-10 w-10 flex items-center justify-center p-1 overflow-hidden shadow-md" title={plataforma.nombre}>
                                                        {plataforma.url ? (
                                                            <img src={plataforma.url} alt={plataforma.nombre} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="text-[8px] text-gray-800 font-bold text-center leading-tight">{plataforma.nombre}</span>
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
                                        <span className="font-bold text-gray-500">Dirección:</span> {selectedPelicula.director?.nombreCompleto || `${selectedPelicula.director?.nombre} ${selectedPelicula.director?.apellido}`}
                                    </p>
                                    <p>
                                        <span className="font-bold text-gray-500">Reparto:</span> {selectedPelicula.actores?.map(a => a.nombreCompleto || a.nombre).slice(0, 5).join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* ========== ESTILOS GLOBALES COMPONENTE ========== */}
                <style>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    /* Botón logout hover copiado de Admin */
                    .logout-btn:hover {
                        background-color: #E50914 !important;
                        border-color: #E50914 !important;
                        color: #fff !important;
                    }
                    /* Navegación - quitar focus azul */
                    button:focus {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    /* Botones navegación estándar (subrayado suave) */
                    .nav-btn {
                        background-color: transparent;
                        border: none;
                        position: relative;
                        color: #bfbfbf;
                        padding: 6px 12px;
                        font-size: 1rem;
                        font-weight: 500;
                        transition: color 0.3s;
                        cursor: pointer;
                    }
                    .nav-btn:hover {
                        color: #fff;
                    }
                    .nav-btn::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 0%;
                        height: 2px;
                        background-color: #E50914;
                        transition: width 0.3s ease;
                    }
                    .nav-btn:hover::after {
                        width: 100%;
                    }

                    /* Botón destacado Cartelera (Estilo Outline Suave) */
                    .nav-btn-highlight {
                        background-color: transparent;
                        color: #e5e5e5;
                        border: 1px solid rgba(229, 9, 20, 0.7);
                        padding: 6px 20px;
                        border-radius: 4px;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .nav-btn-highlight:hover {
                        background-color: rgba(229, 9, 20, 0.2);
                        border-color: #E50914;
                        color: white;
                        box-shadow: 0 0 15px rgba(229, 9, 20, 0.1);
                    }
                `}</style>
            </div>
        </ConfigProvider>
    );
};

// Componente Interno para Carrusel (MovieRow)
const MovieRow = ({ title, movies, onMovieClick, icon }) => {
    const rowRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const isDragging = useRef(false);

    // Scroll buttons
    const scroll = (offset) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    // Drag events
    const handleMouseDown = (e) => {
        isDown.current = true;
        isDragging.current = false;
        rowRef.current.classList.add('cursor-grabbing');
        startX.current = e.pageX - rowRef.current.offsetLeft;
        scrollLeft.current = rowRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown.current = false;
        if (rowRef.current) rowRef.current.classList.remove('cursor-grabbing');
    };

    const handleMouseUp = () => {
        isDown.current = false;
        if (rowRef.current) rowRef.current.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX.current) * 2; // Velocidad del scroll
        if (Math.abs(walk) > 5) isDragging.current = true; // Detectar si hubo arrastre real
        rowRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleCardClick = (pelicula) => {
        if (!isDragging.current) {
            onMovieClick(pelicula);
        }
    };

    return (
        <div className="group/row relative px-8 fade-in mb-8">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-700 pb-2">
                {icon}
                <h2 className="text-2xl font-bold text-white hover:text-red-600 cursor-pointer transition-colors tracking-wide">
                    {title}
                </h2>
            </div>

            {/* Contenedor relativo para flechas y lista */}
            <div className="relative group">
                {/* Flecha Izquierda */}
                {/* Flecha Izquierda */}
                <button
                    onClick={() => scroll(-500)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-zinc-800 w-10 h-16 rounded-r flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white hover:text-red-500 text-xl outline-none focus:outline-none shadow-none"
                    style={{ border: 'none' }}
                >
                    <LeftOutlined />
                </button>

                {/* Lista Scrollable */}
                <div
                    ref={rowRef}
                    className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 cursor-grab"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {movies.map((pelicula) => (
                        <div
                            key={pelicula.id}
                            className="shrink-0 w-[200px] aspect-[2/3] relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-10 group/card select-none shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-white/20"
                            onClick={() => handleCardClick(pelicula)}
                        >
                            <img
                                src={pelicula.posterUrl || 'https://via.placeholder.com/200x300?text=Sin+Imagen'}
                                alt={pelicula.titulo}
                                className="w-full h-full object-cover pointer-events-none" // Evitar drag nativo de imagen
                            />
                            {/* Info Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-2 text-center">
                                <h4 className="text-white font-bold text-sm leading-tight mb-2 drop-shadow-md px-1 line-clamp-2">{pelicula.titulo}</h4>
                                <div className="flex flex-col gap-2 mt-0 px-2 w-full">
                                    <Button
                                        size="small"
                                        icon={<DesktopOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMovieClick(pelicula);
                                        }}
                                        className="w-full font-extrabold border-none shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:brightness-110"
                                        style={{
                                            backgroundColor: '#E50914',
                                            color: 'white',
                                            height: '32px'
                                        }}
                                    >
                                        Más Información
                                    </Button>
                                    <Button
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full font-medium border-none shadow-sm flex items-center justify-center transition-all duration-300 hover:!bg-white hover:!text-black hover:scale-105"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                            color: '#333',
                                            height: '32px'
                                        }}
                                    >
                                        Añadir a Favoritos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Flecha Derecha */}
                <button
                    onClick={() => scroll(500)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-zinc-800 w-10 h-16 rounded-l flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white hover:text-red-500 text-xl outline-none focus:outline-none shadow-none"
                    style={{ border: 'none' }}
                >
                    <RightOutlined />
                </button>
            </div>
        </div>
    );
};

export default CarteleraPage;
