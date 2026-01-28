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
    VideoCameraOutlined,
    HeartFilled,
    HeartOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import MovieDetailModal from '../components/MovieDetailModal';
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
    const [favoritos, setFavoritos] = useState([]);
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

    // Verificar autenticación y cargar datos iniciales
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            navigate('/login');
            return;
        }
        const currentUser = JSON.parse(userJson);
        setUser(currentUser);
        cargarPeliculas();
        cargarFavoritos(currentUser.id);
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

    // Cargar favoritos del usuario
    const cargarFavoritos = async (usuarioId) => {
        try {
            const response = await axios.get(`${API_URL}/usuarios/${usuarioId}/favoritos`);
            setFavoritos(response.data);
        } catch (error) {
            console.error('Error cargando favoritos', error);
        }
    };

    // Comprobar si una película es favorita
    const isFavorito = (peliculaId) => {
        return favoritos.some(fav => fav.id === peliculaId);
    };

    // Añadir o quitar de favoritos
    const toggleFavorito = async (pelicula) => {
        if (!user) return;
        try {
            if (isFavorito(pelicula.id)) {
                await axios.delete(`${API_URL}/usuarios/${user.id}/favoritos/${pelicula.id}`);
                setFavoritos(prev => prev.filter(f => f.id !== pelicula.id));
                message.success('Eliminada de favoritos');
            } else {
                await axios.post(`${API_URL}/usuarios/${user.id}/favoritos/${pelicula.id}`);
                setFavoritos(prev => [...prev, pelicula]);
                message.success('Añadida a favoritos');
            }
        } catch (error) {
            message.error('Error al gestionar favoritos');
        }
    };



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
                            <button className="nav-btn" onClick={() => navigate('/favoritos')}>
                                Mis Películas Favoritas
                            </button>
                            <span className="text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn-highlight" onClick={() => navigate('/cartelera-cine')}>
                                Nuestra Cartelera del Cine!
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
                            isFavorito={isFavorito}
                            toggleFavorito={toggleFavorito}
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
                                isFavorito={isFavorito}
                                toggleFavorito={toggleFavorito}
                            />
                        ))}
                    </div>

                    {/* Footer Simple */}
                    <footer className="py-12 text-center text-gray-500 text-sm border-t border-[#1a1a1a] mt-12 bg-[#0a0a0a]">
                        <p>© 2024 OFH CINEMA. Todos los derechos reservados.</p>
                    </footer>
                </div>

                {/* ========== MODAL DE DETALLES ========== */}
                {/* ========== MODAL DE DETALLES ========== */}
                <MovieDetailModal
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    pelicula={selectedPelicula}
                    isFavorito={isFavorito}
                    toggleFavorito={toggleFavorito}
                />

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
const MovieRow = ({ title, movies, onMovieClick, icon, isFavorito, toggleFavorito }) => {
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
                                        icon={isFavorito && isFavorito(pelicula.id) ? <HeartFilled /> : <HeartOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorito && toggleFavorito(pelicula);
                                        }}
                                        className={`w-full font-medium border-none shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-105 ${isFavorito && isFavorito(pelicula.id) ? 'hover:!bg-red-700' : 'hover:!bg-white hover:!text-black'}`}
                                        style={{
                                            backgroundColor: isFavorito && isFavorito(pelicula.id) ? '#E50914' : 'rgba(255, 255, 255, 0.75)',
                                            color: isFavorito && isFavorito(pelicula.id) ? 'white' : '#333',
                                            height: '32px'
                                        }}
                                    >
                                        {isFavorito && isFavorito(pelicula.id) ? 'Quitar Fav.' : 'Añadir Fav.'}
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
