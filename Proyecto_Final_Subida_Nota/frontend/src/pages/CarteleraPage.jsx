import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, ConfigProvider, theme, message, Tag, Input, Badge, Drawer } from 'antd';
import {
    LogoutOutlined, StarFilled, LeftOutlined, RightOutlined, SearchOutlined,
    ClockCircleOutlined, CalendarOutlined, VideoCameraOutlined, DollarOutlined,
    TeamOutlined, ShoppingCartOutlined, DeleteOutlined, CheckCircleOutlined,
    FireFilled, RocketOutlined, TrophyOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { getNowPlaying, getPopular, getTopRated, getUpcoming, searchMovies } from '../api/tmdb';
import MovieDetailModal from '../components/MovieDetailModal';
import SeatSelector from '../components/SeatSelector';
import dayjs from 'dayjs';
import logo from '../assets/logo.png';

const CarteleraPage = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const { addItem, removeItem, items, getTotal, getCount, clearCart, isInCart } = useCart();

    // TMDB movies
    const [nowPlaying, setNowPlaying] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Backend data
    const [funciones, setFunciones] = useState([]);
    const [peliculasBackend, setPeliculasBackend] = useState([]);

    // UI state
    const [loading, setLoading] = useState(true);
    const [heroMovies, setHeroMovies] = useState([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartOpen, setCartOpen] = useState(false);

    // Movie detail modal
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Seat selector
    const [seatSelectorVisible, setSeatSelectorVisible] = useState(false);
    const [seatSelectorFuncion, setSeatSelectorFuncion] = useState(null);

    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#E50914', colorBgContainer: '#1a1a1a', colorBgElevated: '#1f1f1f', borderRadius: 8 },
    };

    // Cargar datos al montar
    useEffect(() => {
        loadData();
    }, []);

    // Hero carousel auto-rotate
    useEffect(() => {
        if (heroMovies.length <= 1) return;
        const interval = setInterval(() => setCurrentHeroIndex(prev => (prev + 1) % heroMovies.length), 7000);
        return () => clearInterval(interval);
    }, [heroMovies]);

    // Búsqueda con debounce
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            const results = await searchMovies(searchTerm);
            setSearchResults(results);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Cargar TMDB + Backend en paralelo
            const [npRes, popRes, trRes, upRes, funcRes, pelRes] = await Promise.all([
                getNowPlaying(),
                getPopular(),
                getTopRated(),
                getUpcoming(),
                api.get('/api/v1/funciones'),
                api.get('/api/v1/peliculas'),
            ]);

            setNowPlaying(npRes);
            setPopular(popRes);
            setTopRated(trRes);
            setUpcoming(upRes);
            setFunciones(funcRes.data);
            setPeliculasBackend(pelRes.data);

            // Hero: 3 películas de "now playing" con backdrop
            const withBackdrop = npRes.filter(m => m.backdropUrl);
            const shuffled = [...withBackdrop].sort(() => 0.5 - Math.random());
            setHeroMovies(shuffled.slice(0, 4));
        } catch (error) {
            message.error('Error al cargar la cartelera');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setModalVisible(true);
    };

    // Funciones del backend que coinciden por título (para mostrar en el modal)
    const getFuncionesForMovie = (movieTitle) => {
        if (!movieTitle) return [];
        return funciones.filter(f =>
            f.peliculaTitulo?.toLowerCase().includes(movieTitle.toLowerCase())
        );
    };

    // Abrir selector de butacas para una función
    const handleOpenSeatSelector = (funcion) => {
        setSeatSelectorFuncion(funcion);
        setSeatSelectorVisible(true);
    };

    // Callback cuando el usuario confirma asientos en el SeatSelector
    const handleSeatConfirm = async (selectedSeats) => {
        if (!seatSelectorFuncion) return;
        try {
            await api.post('/api/v1/ventas/comprar', {
                metodoPago: 'TARJETA',
                entradas: selectedSeats.map(s => ({
                    funcionId: seatSelectorFuncion.id,
                    fila: s.fila,
                    asiento: s.asiento
                }))
            });
            message.success(`🎟️ ¡${selectedSeats.length} entrada(s) comprada(s) para "${seatSelectorFuncion.peliculaTitulo}"!`);
            setSeatSelectorVisible(false);
            setSeatSelectorFuncion(null);
            loadData();
        } catch (error) {
            message.error(error.response?.data?.message || 'Error al procesar la compra');
        }
    };

    // Añadir al carrito (from MovieDetailModal)
    const handleAddToCart = (funcion) => {
        handleOpenSeatSelector(funcion);
    };

    // Comprar todo el carrito
    const handleCheckout = async () => {
        if (items.length === 0) return;
        try {
            for (const item of items) {
                await api.post('/api/v1/ventas/comprar', {
                    metodoPago: 'TARJETA',
                    entradas: (item.seats || [{ fila: 1, asiento: 1 }]).map(s => ({
                        funcionId: item.id,
                        fila: s.fila,
                        asiento: s.asiento
                    }))
                });
            }
            message.success(`¡${items.length} entrada(s) comprada(s) correctamente!`);
            clearCart();
            setCartOpen(false);
            loadData();
        } catch (error) {
            message.error(error.response?.data?.message || 'Error al procesar la compra');
        }
    };

    // Agrupar funciones por fecha para la sección de sesiones
    const funcionesPorDia = funciones.reduce((acc, f) => {
        const fecha = f.fechaHora ? dayjs(f.fechaHora).format('YYYY-MM-DD') : null;
        if (!fecha) return acc;
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(f);
        return acc;
    }, {});
    const fechasOrdenadas = Object.keys(funcionesPorDia).sort();

    const getDiaLabel = (fecha) => {
        const hoy = dayjs().startOf('day');
        const d = dayjs(fecha);
        if (d.isSame(hoy, 'day')) return '📅 HOY';
        if (d.isSame(hoy.add(1, 'day'), 'day')) return '📅 MAÑANA';
        return `📅 ${d.format('dddd, DD MMMM').toUpperCase()}`;
    };

    if (loading) {
        return (<ConfigProvider theme={darkTheme}><div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]"><Spin size="large" /></div></ConfigProvider>);
    }

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
                {/* ========== HEADER ========== */}
                <header className="flex items-center justify-between flex-wrap gap-y-1 px-3 sm:px-8 shrink-0" style={{ backgroundColor: '#0a0a0a', minHeight: '56px', borderBottom: '1px solid #1a1a1a' }}>
                    <div className="flex items-center gap-2 sm:gap-6">
                        <img src={logo} alt="OFHCINEMA" className="h-8 sm:h-12" />
                        <div className="h-8 w-px bg-gray-800 hidden sm:block"></div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button className="nav-btn active">Inicio</button>
                            <span className="nav-separator text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn" onClick={() => navigate('/sesiones')}>Sesiones</button>
                            <span className="nav-separator text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn" onClick={() => navigate('/mis-entradas')}>Mis Entradas</button>
                            {isAdmin() && (<>
                                <span className="nav-separator text-gray-700 text-xl font-thin mx-2">|</span>
                                <button className="nav-btn-highlight" onClick={() => navigate('/admin')}>Panel Admin</button>
                            </>)}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-5 shrink-0">
                        <div className="text-right">
                            <span className="user-greeting text-gray-500 text-xs block">👋 {new Date().getHours() < 14 ? 'Buenos días' : new Date().getHours() < 21 ? 'Buenas tardes' : 'Buenas noches'}</span>
                            <span className="user-name text-white font-medium text-sm sm:text-base whitespace-nowrap">{user?.nombre || user?.email}</span>
                        </div>
                        <Button icon={<LogoutOutlined />} onClick={handleLogout} className="logout-btn"
                            style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a', color: '#999' }}>Cerrar Sesión</Button>
                    </div>
                </header>

                {/* ========== CONTENIDO ========== */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* ===== HERO SECTION (TMDB Backdrops) ===== */}
                    {heroMovies.length > 0 && (
                        <section className="relative w-full h-[60vh] flex items-end group overflow-hidden">
                            {heroMovies.map((movie, idx) => (
                                <div key={movie.tmdbId} className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out group-hover:scale-105 ${idx === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                    style={{ backgroundImage: `url(${movie.backdropUrl})` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
                                </div>
                            ))}
                            <div className="relative z-10 p-6 sm:p-12 max-w-4xl flex flex-col items-start text-left transition-opacity duration-500">
                                <Tag color="red" className="mb-4 text-sm font-bold tracking-wider px-3 py-1">EN CARTELERA</Tag>
                                <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-2xl text-white tracking-tight leading-tight">
                                    {heroMovies[currentHeroIndex]?.titulo}
                                </h1>
                                <p className="text-lg text-gray-300 mb-6 line-clamp-3 max-w-2xl drop-shadow-md">
                                    {heroMovies[currentHeroIndex]?.sinopsis}
                                </p>
                                <div className="hero-actions flex items-center gap-4 flex-wrap">
                                    <Button size="large" icon={<VideoCameraOutlined />}
                                        onClick={() => handleMovieClick(heroMovies[currentHeroIndex])}
                                        style={{ backgroundColor: '#E50914', color: 'white', border: 'none', fontWeight: 'bold', height: 52, paddingLeft: 32, paddingRight: 32, fontSize: '1.1rem' }}>
                                        Más Información
                                    </Button>
                                    <div className="flex items-center gap-2 text-gray-400 shrink-0 whitespace-nowrap">
                                        <StarFilled className="text-yellow-500" />
                                        <span className="text-white font-bold">{heroMovies[currentHeroIndex]?.valoracion}</span>
                                        <span className="text-gray-500">/ 10</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-12 bottom-12 flex gap-2 z-20">
                                {heroMovies.map((_, idx) => (
                                    <button key={idx} onClick={() => setCurrentHeroIndex(idx)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'bg-red-600 w-6' : 'bg-gray-500 hover:bg-white'}`} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ===== BARRA DE BÚSQUEDA ===== */}
                    <div className="px-8 pt-8 pb-4">
                        <Input prefix={<SearchOutlined className="text-gray-500" />} placeholder="Buscar películas..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} allowClear
                            className="!bg-zinc-800 !text-white !border-zinc-700 hover:!border-red-500 focus:!border-red-500 !rounded-lg"
                            style={{ backgroundColor: '#1f1f1f', color: 'white', maxWidth: 500, height: 48 }} />
                    </div>

                    {/* ===== RESULTADOS DE BÚSQUEDA ===== */}
                    {searchTerm && searchResults.length > 0 && (
                        <MovieRow title={`Resultados para "${searchTerm}"`} icon={<SearchOutlined className="text-blue-400" />}
                            movies={searchResults} onMovieClick={handleMovieClick} />
                    )}
                    {searchTerm && searchResults.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No se encontraron películas para "{searchTerm}"</p>
                        </div>
                    )}

                    {/* ===== FILAS DE PELÍCULAS ===== */}
                    {!searchTerm && (
                        <>
                            {/* En Cartelera: películas del backend que tienen sesiones programadas */}
                            {(() => {
                                const pelisConSesion = peliculasBackend.filter(p =>
                                    funciones.some(f => f.peliculaId === p.id)
                                ).map(p => ({
                                    tmdbId: `backend-${p.id}`,
                                    titulo: p.titulo,
                                    posterUrl: p.imagenUrl,
                                    genero: p.genero || '',
                                    sinopsis: p.sinopsis || '',
                                    valoracion: 0,
                                    _backendId: p.id,
                                }));
                                return pelisConSesion.length > 0 ? (
                                    <MovieRow title="🔥 En Cartelera" icon={<FireFilled className="text-orange-500" />}
                                        movies={pelisConSesion} onMovieClick={(m) => {
                                            const orig = peliculasBackend.find(p => p.id === m._backendId);
                                            if (orig) handleMovieClick({ ...m, ...orig, posterUrl: orig.imagenUrl });
                                            else handleMovieClick(m);
                                        }} />
                                ) : null;
                            })()}
                            {popular.length > 0 && (
                                <MovieRow title="⭐ Populares" icon={<StarFilled className="text-yellow-500" />}
                                    movies={popular} onMovieClick={handleMovieClick} />
                            )}
                            {topRated.length > 0 && (
                                <MovieRow title="🏆 Mejor Valoradas" icon={<TrophyOutlined className="text-yellow-400" />}
                                    movies={topRated} onMovieClick={handleMovieClick} />
                            )}
                            {upcoming.length > 0 && (
                                <MovieRow title="🚀 Próximos Estrenos" icon={<RocketOutlined className="text-cyan-400" />}
                                    movies={upcoming} onMovieClick={handleMovieClick} />
                            )}
                        </>
                    )}



                    <footer className="py-8 text-center text-gray-500 text-sm border-t border-[#1a1a1a]">
                        <p>© 2026 OFH CINEMA. Todos los derechos reservados.</p>
                    </footer>
                </div>

                {/* ========== MOVIE DETAIL MODAL (TMDB) ========== */}
                <MovieDetailModal
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    pelicula={selectedMovie}
                    funciones={selectedMovie ? getFuncionesForMovie(selectedMovie.titulo) : []}
                    onAddToCart={handleAddToCart}
                    isInCart={isInCart}
                />

                {/* ========== SEAT SELECTOR MODAL ========== */}
                <SeatSelector
                    visible={seatSelectorVisible}
                    onCancel={() => { setSeatSelectorVisible(false); setSeatSelectorFuncion(null); }}
                    funcion={seatSelectorFuncion}
                    onConfirm={handleSeatConfirm}
                />

                {/* ========== DRAWER DEL CARRITO ========== */}
                <Drawer title={<span className="text-white text-xl font-bold">🛒 Mi Carrito ({getCount()})</span>}
                    placement="right" width={420} open={cartOpen} onClose={() => setCartOpen(false)}
                    styles={{ body: { backgroundColor: '#0f0f0f', padding: '16px' }, header: { backgroundColor: '#0f0f0f', borderBottom: '1px solid #333' } }}
                    extra={items.length > 0 && <Button type="text" danger size="small" onClick={clearCart}>Vaciar</Button>}>
                    {items.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingCartOutlined className="text-5xl text-gray-600 mb-4" />
                            <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                            <p className="text-gray-600 text-sm mt-2">Añade sesiones desde la cartelera</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-3 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-bold">{item.peliculaTitulo}</h4>
                                            <p className="text-gray-500 text-sm">{dayjs(item.fechaHora).format('DD/MM HH:mm')} • {item.salaNombre}</p>
                                            <p className="text-green-400 font-bold mt-1">{item.precio?.toFixed(2)}€</p>
                                        </div>
                                        <Button icon={<DeleteOutlined />} size="small" danger onClick={() => removeItem(item.id)}
                                            style={{ borderColor: '#E50914', color: '#E50914' }} />
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-zinc-700 pt-4 mt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-lg">Total:</span>
                                    <span className="text-green-400 text-3xl font-black">{getTotal().toFixed(2)}€</span>
                                </div>
                                <Button block size="large" icon={<CheckCircleOutlined />} onClick={handleCheckout}
                                    style={{ backgroundColor: '#E50914', color: 'white', border: 'none', height: 52, fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    Confirmar Compra ({getCount()} entrada{getCount() > 1 ? 's' : ''})
                                </Button>
                            </div>
                        </div>
                    )}
                </Drawer>
            </div>
        </ConfigProvider>
    );
};

// ===== MOVIE ROW - Carrusel estilo Netflix con posters TMDB =====
const MovieRow = ({ title, movies, icon, onMovieClick }) => {
    const rowRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeftRef = useRef(0);
    const isDragging = useRef(false);

    const scroll = (offset) => rowRef.current?.scrollBy({ left: offset, behavior: 'smooth' });

    const handleMouseDown = (e) => {
        isDown.current = true;
        isDragging.current = false;
        startX.current = e.pageX - rowRef.current.offsetLeft;
        scrollLeftRef.current = rowRef.current.scrollLeft;
    };
    const handleMouseLeave = () => { isDown.current = false; };
    const handleMouseUp = () => { isDown.current = false; };
    const handleMouseMove = (e) => {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        if (Math.abs(walk) > 5) isDragging.current = true;
        rowRef.current.scrollLeft = scrollLeftRef.current - walk;
    };
    const handleCardClick = (movie) => {
        if (!isDragging.current) onMovieClick(movie);
    };

    return (
        <div className="group/row relative px-8 mb-8 mt-4">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-700 pb-2">
                {icon}
                <h2 className="text-2xl font-bold text-white hover:text-red-600 cursor-pointer transition-colors tracking-wide">{title}</h2>
            </div>

            <div className="relative group">
                <button onClick={() => scroll(-500)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-zinc-800 w-10 h-16 rounded-r flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white hover:text-red-500 text-xl"
                    style={{ border: 'none' }}>
                    <LeftOutlined />
                </button>

                <div ref={rowRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 cursor-grab select-none"
                    onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                    {movies.map(movie => (
                        <div key={movie.tmdbId} onClick={() => handleCardClick(movie)}
                            className="shrink-0 w-[200px] aspect-[2/3] relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-10 group/card shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-white/20">
                            <img src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300'}
                                alt={movie.titulo} className="w-full h-full object-cover pointer-events-none" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-3 text-center">
                                <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{movie.titulo}</h4>
                                <p className="text-gray-400 text-xs">{movie.genero}</p>
                                {movie.valoracion > 0 && (
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <StarFilled className="text-yellow-500 text-xs" />
                                        <span className="text-yellow-400 text-xs font-bold">{movie.valoracion}</span>
                                    </div>
                                )}
                                <Button size="small" icon={<VideoCameraOutlined />}
                                    onClick={(e) => { e.stopPropagation(); onMovieClick(movie); }}
                                    className="w-full mt-2 font-extrabold border-none shadow-lg transition-all hover:scale-105 hover:brightness-110"
                                    style={{ backgroundColor: '#E50914', color: 'white', height: '30px' }}>
                                    Más Info
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => scroll(500)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-zinc-800 w-10 h-16 rounded-l flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white hover:text-red-500 text-xl"
                    style={{ border: 'none' }}>
                    <RightOutlined />
                </button>
            </div>
        </div>
    );
};

export default CarteleraPage;
