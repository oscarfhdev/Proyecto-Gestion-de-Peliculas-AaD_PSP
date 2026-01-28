import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Spin,
    ConfigProvider,
    theme,
    message,
    Empty,
    Modal,
    Tag,
    Divider
} from 'antd';
import {
    LogoutOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    VideoCameraOutlined,
    DollarOutlined,
    TeamOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import logo from '../assets/logo.png';

const API_URL = 'http://localhost:8081/api';

const CarteleraCinePage = () => {
    const navigate = useNavigate();
    const [funciones, setFunciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFuncion, setSelectedFuncion] = useState(null);
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

    // Verificar autenticación y cargar funciones
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            navigate('/login');
            return;
        }
        const currentUser = JSON.parse(userJson);
        setUser(currentUser);
        cargarFunciones();
    }, [navigate]);

    // Cargar funciones de cine
    const cargarFunciones = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/funciones`);
            // Ordenar por fecha y hora
            const ordenadas = response.data.sort((a, b) => {
                const dateA = new Date(`${a.fecha}T${a.hora}`);
                const dateB = new Date(`${b.fecha}T${b.hora}`);
                return dateA - dateB;
            });
            setFunciones(ordenadas);
        } catch (error) {
            message.error('Error al cargar la cartelera');
        } finally {
            setLoading(false);
        }
    };

    // Abrir modal de detalle
    const handleVerDetalle = (funcion) => {
        setSelectedFuncion(funcion);
        setModalVisible(true);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Agrupar funciones por FECHA para organizar por días
    const funcionesPorDia = funciones.reduce((acc, funcion) => {
        const fecha = funcion.fecha;
        if (!fecha) return acc;
        if (!acc[fecha]) {
            acc[fecha] = [];
        }
        acc[fecha].push(funcion);
        return acc;
    }, {});

    // Ordenar las fechas
    const fechasOrdenadas = Object.keys(funcionesPorDia).sort((a, b) => new Date(a) - new Date(b));

    // Dentro de cada día, agrupar por película
    const getDiaLabel = (fecha) => {
        const hoy = dayjs().startOf('day');
        const fechaDayjs = dayjs(fecha);
        if (fechaDayjs.isSame(hoy, 'day')) return '📅 HOY';
        if (fechaDayjs.isSame(hoy.add(1, 'day'), 'day')) return '📅 MAÑANA';
        return `📅 ${fechaDayjs.format('dddd, DD MMMM').toUpperCase()}`;
    };

    if (loading) {
        return (
            <ConfigProvider theme={darkTheme}>
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                    <Spin size="large" />
                </div>
            </ConfigProvider>
        );
    }

    return (
        <ConfigProvider theme={darkTheme}>
            {/* ========== WRAPPER IDÉNTICO A CARTELERA ========== */}
            <div
                className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden"
                style={{ backgroundColor: '#0a0a0a' }}
            >
                {modalContextHolder}

                {/* ========== HEADER (Idéntico al resto) ========== */}
                <header
                    className="flex items-center justify-between px-8 shrink-0"
                    style={{ backgroundColor: '#0a0a0a', height: '72px', borderBottom: '1px solid #1a1a1a' }}
                >
                    <div className="flex items-center gap-6">
                        <img src={logo} alt="OFHCINEMA" className="h-19" />
                        <div className="h-8 w-px bg-gray-800"></div>

                        {/* Navegación */}
                        <div className="flex items-center gap-2 ml-2">
                            <button className="nav-btn" onClick={() => navigate('/cartelera')}>
                                Mejores Películas
                            </button>
                            <span className="text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn" onClick={() => navigate('/favoritos')}>
                                Mis Películas Favoritas
                            </button>
                            <span className="text-gray-700 text-xl font-thin mx-2">|</span>
                            {/* Este botón está DESTACADO porque estamos en esta página */}
                            <button className="nav-btn-highlight">
                                Nuestra Cartelera del Cine!
                            </button>
                        </div>
                    </div>

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
                    {/* Título de Sección */}
                    <div className="px-8 pt-10 pb-6">
                        <div className="flex items-center gap-3 mb-2 border-b border-zinc-700 pb-4">
                            <VideoCameraOutlined className="text-red-500 text-3xl" />
                            <h2 className="text-3xl font-bold text-white hover:text-red-600 cursor-pointer transition-colors tracking-wide">
                                🎬 Cartelera del Cine - Próximas Funciones
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                            Programación organizada por días. Haz clic en un horario para ver más detalles y reservar.
                        </p>
                    </div>

                    {/* Grid de Funciones por DÍA */}
                    <div className="px-8 pb-12">
                        {fechasOrdenadas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Empty
                                    description={
                                        <span className="text-gray-500 text-lg">
                                            No hay funciones programadas actualmente
                                        </span>
                                    }
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => navigate('/cartelera')}
                                    className="mt-6"
                                    style={{ backgroundColor: '#E50914', border: 'none' }}
                                >
                                    Ver Catálogo de Películas
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {fechasOrdenadas.map((fecha) => {
                                    const funcionesDelDia = funcionesPorDia[fecha];
                                    // Agrupar por película dentro del día
                                    const peliculasDelDia = funcionesDelDia.reduce((acc, funcion) => {
                                        const peliculaId = funcion.pelicula?.id;
                                        if (!peliculaId) return acc;
                                        if (!acc[peliculaId]) {
                                            acc[peliculaId] = {
                                                pelicula: funcion.pelicula,
                                                funciones: []
                                            };
                                        }
                                        acc[peliculaId].funciones.push(funcion);
                                        return acc;
                                    }, {});

                                    return (
                                        <div key={fecha} className="mb-8">
                                            {/* Header del Día */}
                                            <div className="flex items-center gap-4 mb-6 sticky top-0 bg-[#0a0a0a] py-3 z-10">
                                                <h3 className="text-2xl font-black text-white tracking-tight">
                                                    {getDiaLabel(fecha)}
                                                </h3>
                                                <span className="text-gray-500 text-sm">
                                                    {dayjs(fecha).format('DD/MM/YYYY')}
                                                </span>
                                                <div className="flex-1 h-px bg-zinc-700"></div>
                                            </div>

                                            {/* Películas del Día */}
                                            <div className="space-y-8">
                                                {Object.values(peliculasDelDia).map(({ pelicula, funciones: funcionesPeli }) => (
                                                    <div key={pelicula.id} className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800/50 hover:border-zinc-700 transition-all flex gap-8">
                                                        {/* Poster GRANDE */}
                                                        <img
                                                            src={pelicula.posterUrl || 'https://via.placeholder.com/150x225?text=Sin+Imagen'}
                                                            alt={pelicula.titulo}
                                                            className="w-32 h-48 object-cover rounded-xl shadow-xl shrink-0"
                                                        />

                                                        {/* Info y Horarios */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-3xl font-bold text-white mb-3">{pelicula.titulo}</h4>
                                                            <div className="flex items-center gap-5 text-lg text-gray-400 mb-5">
                                                                <span>{pelicula.categorias?.[0]?.nombre || 'Sin categoría'}</span>
                                                                <span>•</span>
                                                                <span>{pelicula.duracion} min</span>
                                                                <span>•</span>
                                                                <span className="text-yellow-500">★ {pelicula.valoracion || '0'}</span>
                                                            </div>

                                                            {/* Horarios en fila - MUY GRANDES */}
                                                            <div className="flex flex-wrap gap-4">
                                                                {funcionesPeli
                                                                    .sort((a, b) => a.hora?.localeCompare(b.hora))
                                                                    .map((funcion) => (
                                                                        <button
                                                                            key={funcion.id}
                                                                            onClick={() => handleVerDetalle(funcion)}
                                                                            className="bg-zinc-800 hover:bg-red-600 transition-all duration-200 rounded-xl px-6 py-4 text-center group border border-zinc-700 hover:border-red-500 hover:scale-105 shadow-lg"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <ClockCircleOutlined className="text-red-500 group-hover:text-white text-lg" />
                                                                                <span className="text-white font-bold text-xl">
                                                                                    {funcion.hora?.slice(0, 5) || '--:--'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-sm text-gray-500 group-hover:text-gray-200 mt-1">
                                                                                Sala {funcion.sala?.numeroSala} • {funcion.precio?.toFixed(2)}€
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="py-8 text-center text-gray-500 text-sm border-t border-[#1a1a1a]">
                        <p>© 2024 OFH CINEMA. Todos los derechos reservados.</p>
                    </footer>
                </div>

                {/* ========== MODAL DE DETALLE DE FUNCIÓN ========== */}
                <Modal
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    width={600}
                    centered
                    destroyOnHidden
                    closeIcon={<span className="text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-colors">✕</span>}
                    styles={{
                        content: { padding: 0, backgroundColor: '#181818', borderRadius: 12, overflow: 'hidden', border: '1px solid #333' },
                        body: { padding: 0 },
                        mask: { backdropFilter: 'blur(5px)' }
                    }}
                >
                    {selectedFuncion && (
                        <div className="p-8">
                            {/* Header del Modal */}
                            <div className="flex gap-6 mb-6">
                                <img
                                    src={selectedFuncion.pelicula?.posterUrl || 'https://via.placeholder.com/150x225?text=Sin+Imagen'}
                                    alt={selectedFuncion.pelicula?.titulo}
                                    className="w-32 h-48 object-cover rounded-lg shadow-xl"
                                />
                                <div>
                                    <h2 className="text-3xl font-black text-white mb-2">{selectedFuncion.pelicula?.titulo}</h2>
                                    <Tag color="red" className="mb-3">{selectedFuncion.formato || 'Digital'}</Tag>
                                    <div className="text-gray-400 text-sm">
                                        <div className="flex items-center gap-2">
                                            🎬 {selectedFuncion.pelicula?.categorias?.[0]?.nombre || 'Sin categoría'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            ⏱️ {selectedFuncion.pelicula?.duracion} minutos
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Divider className="bg-zinc-700 my-6" />

                            {/* Detalles de la Función */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                                    <CalendarOutlined className="text-red-500 text-2xl mb-2" />
                                    <h4 className="text-white font-bold">Fecha</h4>
                                    <p className="text-gray-300">{dayjs(selectedFuncion.fecha).format('dddd, DD MMMM YYYY')}</p>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                                    <ClockCircleOutlined className="text-red-500 text-2xl mb-2" />
                                    <h4 className="text-white font-bold">Hora</h4>
                                    <p className="text-gray-300 text-2xl font-bold">{selectedFuncion.hora?.slice(0, 5) || '--:--'}</p>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-lg text-center">
                                    <VideoCameraOutlined className="text-red-500 text-2xl mb-2" />
                                    <h4 className="text-white font-bold">Sala</h4>
                                    <p className="text-gray-300 text-2xl font-bold">Sala {selectedFuncion.sala?.numeroSala || '?'}</p>
                                    <p className="text-gray-500 text-xs flex items-center justify-center gap-1 mt-1">
                                        <TeamOutlined /> {selectedFuncion.sala?.capacidad || '?'} asientos
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-900/50 to-green-700/30 p-4 rounded-lg text-center border border-green-600/50">
                                    <DollarOutlined className="text-green-400 text-2xl mb-2" />
                                    <h4 className="text-white font-bold">Precio</h4>
                                    <p className="text-green-400 text-3xl font-black">{selectedFuncion.precio?.toFixed(2) || '0.00'}€</p>
                                </div>
                            </div>

                            {/* Botón de Acción */}
                            <Button
                                block
                                size="large"
                                icon={<PlayCircleOutlined />}
                                onClick={() => {
                                    message.success(`¡Reserva confirmada para ${selectedFuncion.pelicula?.titulo}!`);
                                    setModalVisible(false);
                                }}
                                style={{
                                    backgroundColor: '#E50914',
                                    color: 'white',
                                    border: 'none',
                                    height: 52,
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Reservar Entrada
                            </Button>
                        </div>
                    )}
                </Modal>

                {/* ========== ESTILOS GLOBALES (Idénticos a otras páginas) ========== */}
                <style>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #0a0a0a;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #333;
                        border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                    .logout-btn:hover {
                        background-color: #E50914 !important;
                        border-color: #E50914 !important;
                        color: #fff !important;
                    }
                    button:focus {
                        outline: none !important;
                        box-shadow: none !important;
                    }
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

export default CarteleraCinePage;
