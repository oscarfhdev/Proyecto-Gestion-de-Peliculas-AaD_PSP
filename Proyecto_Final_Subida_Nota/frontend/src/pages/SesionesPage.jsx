import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, ConfigProvider, theme, message, Tag, Badge, Drawer, Tabs } from 'antd';
import {
    LogoutOutlined, ShoppingCartOutlined, DeleteOutlined, CheckCircleOutlined,
    ClockCircleOutlined, VideoCameraOutlined, CalendarOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import SeatSelector from '../components/SeatSelector';
import MovieDetailModal from '../components/MovieDetailModal';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import logo from '../assets/logo.png';

dayjs.locale('es');

const SesionesPage = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const { items, getTotal, getCount, clearCart, isInCart, removeItem } = useCart();

    const [funciones, setFunciones] = useState([]);
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartOpen, setCartOpen] = useState(false);

    // Seat selector
    const [seatSelectorVisible, setSeatSelectorVisible] = useState(false);
    const [seatSelectorFuncion, setSeatSelectorFuncion] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);

    // Movie Detail Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#E50914', colorBgContainer: '#1a1a1a', colorBgElevated: '#1f1f1f', borderRadius: 8 },
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [funcRes, pelRes] = await Promise.all([
                api.get('/api/v1/funciones'),
                api.get('/api/v1/peliculas')
            ]);
            setFunciones(funcRes.data);
            setPeliculas(pelRes.data);
        } catch (error) {
            message.error('Error al cargar las sesiones');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleOpenSeatSelector = async (funcion) => {
        try {
            const res = await api.get(`/api/v1/funciones/${funcion.id}/ocupados`);
            setOccupiedSeats(res.data);
            setSeatSelectorFuncion(funcion);
            setSeatSelectorVisible(true);
        } catch (error) {
            message.error('Error al cargar asientos ocupados');
        }
    };

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

    const getDiaLabel = (fecha) => {
        const hoy = dayjs().startOf('day');
        const d = dayjs(fecha);
        if (d.isSame(hoy, 'day')) return '📅 HOY';
        if (d.isSame(hoy.add(1, 'day'), 'day')) return '📅 MAÑANA';
        return `📅 ${d.format('dddd, DD MMM').toUpperCase()}`;
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

    const renderDiaContent = (funcionesDelDia) => {
        const peliculasDelDia = funcionesDelDia.reduce((acc, funcion) => {
            const peliculaBackend = peliculas.find(p => p.id === funcion.peliculaId);
            const titulo = funcion.peliculaTitulo || 'Sin título';
            if (!acc[titulo]) {
                acc[titulo] = { 
                    titulo, 
                    funciones: [],
                    imagenUrl: peliculaBackend?.imagenUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300'
                };
            }
            acc[titulo].funciones.push(funcion);
            return acc;
        }, {});

        return (
            <div className="space-y-6 animate-fade-in pb-12 pt-4">
                {Object.values(peliculasDelDia).map(({ titulo, funciones: funcionesPeli, imagenUrl }) => (
                    <div key={titulo} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all flex flex-col md:flex-row gap-6">
                        
                        {/* Imagen de la película */}
                        <div 
                            className="w-full md:w-48 h-72 md:h-64 shrink-0 rounded-xl overflow-hidden shadow-2xl relative border border-zinc-800 cursor-pointer group/poster"
                            onClick={() => {
                                const peli = peliculas.find(p => p.titulo === titulo);
                                if (peli) {
                                    setSelectedMovie(peli);
                                    setModalVisible(true);
                                }
                            }}
                        >
                            <img src={imagenUrl} alt={titulo} className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-center justify-center">
                                <VideoCameraOutlined className="text-white text-4xl drop-shadow-lg" />
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <Tag color="red" className="m-0 border-none font-bold">En cartelera</Tag>
                            </div>
                        </div>

                        {/* Contenido e Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-3xl font-black text-white mb-6 tracking-tight">
                                {titulo}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {funcionesPeli
                                    .sort((a, b) => (a.fechaHora || '').localeCompare(b.fechaHora || ''))
                                    .map(funcion => (
                                        <button key={funcion.id} onClick={() => handleOpenSeatSelector(funcion)}
                                            className={`${isInCart(funcion.id) ? 'bg-green-900/40 border-green-600' : 'bg-zinc-800 border-zinc-700 hover:bg-red-600 hover:border-red-500'} transition-all duration-200 rounded-xl px-6 py-4 text-center group border hover:scale-105 shadow-lg relative`}>
                                            <div className="flex items-center gap-2">
                                                <ClockCircleOutlined className="text-red-500 group-hover:text-white text-lg" />
                                                <span className="text-white font-bold text-xl">{dayjs(funcion.fechaHora).format('HH:mm')}</span>
                                            </div>
                                            <div className="text-sm text-gray-400 group-hover:text-gray-200 mt-1">
                                                {funcion.salaNombre} • {funcion.precio?.toFixed(2)}€
                                            </div>
                                            <div className="text-xs text-gray-500 group-hover:text-gray-200 mt-1">
                                                {funcion.asientosDisponibles} libres
                                            </div>
                                            {isInCart(funcion.id) && (
                                                <div className="absolute -top-3 -right-3">
                                                    <Tag color="green" className="m-0 border-2 border-[#0a0a0a] shadow-lg rounded-full px-2 py-0.5"><CheckCircleOutlined /> En carrito</Tag>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (<ConfigProvider theme={darkTheme}><div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a]"><Spin size="large" /></div></ConfigProvider>);
    }

    const tabItems = fechasOrdenadas.map(fecha => ({
        key: fecha,
        label: (
            <div className="px-4 py-2 font-bold text-lg">
                {getDiaLabel(fecha)}
            </div>
        ),
        children: renderDiaContent(funcionesPorDia[fecha])
    }));

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
                {/* ========== HEADER ========== */}
                <header className="flex items-center justify-between flex-wrap gap-y-1 px-3 sm:px-8 shrink-0" style={{ backgroundColor: '#0a0a0a', minHeight: '56px', borderBottom: '1px solid #1a1a1a' }}>
                    <div className="flex items-center gap-2 sm:gap-6">
                        <img src={logo} alt="OFHCINEMA" className="h-8 sm:h-12" />
                        <div className="h-8 w-px bg-gray-800 hidden sm:block"></div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button className="nav-btn" onClick={() => navigate('/cartelera')}>Inicio</button>
                            <span className="nav-separator text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn active">Sesiones</button>
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
                    <div className="px-8 pt-10 pb-2">
                        <div className="flex items-center gap-3 mb-2 pb-4">
                            <CalendarOutlined className="text-red-500 text-4xl" />
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tight">Comprar Entradas</h2>
                                <p className="text-gray-400 text-base mt-1">
                                    Selecciona el día y el horario de tu sesión para reservar tus butacas.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-12">
                        {fechasOrdenadas.length === 0 ? (
                            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800">
                                <CalendarOutlined className="text-6xl text-gray-600 mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">No hay sesiones disponibles</h3>
                                <p className="text-gray-500 text-lg">Vuelve más tarde para ver nuestra programación.</p>
                            </div>
                        ) : (
                            <Tabs 
                                defaultActiveKey={fechasOrdenadas[0]} 
                                items={tabItems} 
                                size="large"
                                tabBarGutter={24}
                                className="custom-cinema-tabs"
                                tabBarStyle={{ borderBottom: '2px solid #27272a' }}
                            />
                        )}
                    </div>

                    <footer className="py-8 text-center text-gray-500 text-sm border-t border-[#1a1a1a]">
                        <p>© 2026 OFH CINEMA. Todos los derechos reservados.</p>
                    </footer>
                </div>

                {/* ========== SEAT SELECTOR MODAL ========== */}
                <SeatSelector
                    visible={seatSelectorVisible}
                    onCancel={() => { setSeatSelectorVisible(false); setSeatSelectorFuncion(null); setOccupiedSeats([]); }}
                    funcion={seatSelectorFuncion}
                    onConfirm={handleSeatConfirm}
                    occupiedSeats={occupiedSeats}
                />

                {/* ========== MOVIE DETAIL MODAL ========== */}
                <MovieDetailModal
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    pelicula={selectedMovie}
                    funciones={selectedMovie ? funciones.filter(f => f.peliculaId === selectedMovie.id) : []}
                    onAddToCart={handleOpenSeatSelector}
                    isInCart={isInCart}
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
            <style>{`
                .custom-cinema-tabs .ant-tabs-tab {
                    padding: 8px 0;
                    margin: 0 !important;
                    transition: all 0.3s;
                }
                .custom-cinema-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: white !important;
                    text-shadow: 0 0 10px rgba(255,255,255,0.3);
                }
                .custom-cinema-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
                    color: #E50914 !important;
                }
                .custom-cinema-tabs .ant-tabs-ink-bar {
                    background: #E50914 !important;
                    height: 4px !important;
                    border-radius: 4px 4px 0 0;
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </ConfigProvider>
    );
};

export default SesionesPage;
