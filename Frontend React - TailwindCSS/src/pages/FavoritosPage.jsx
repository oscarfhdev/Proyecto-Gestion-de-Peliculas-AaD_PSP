import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Spin,
    ConfigProvider,
    theme,
    message,
    Empty,
    Modal
} from 'antd';
import {
    LogoutOutlined,
    HeartFilled,
    HeartOutlined,
    DesktopOutlined
} from '@ant-design/icons';
import axios from 'axios';
import logo from '../assets/logo.png';
import MovieDetailModal from '../components/MovieDetailModal';

const API_URL = 'http://localhost:8081/api';

const FavoritosPage = () => {
    const navigate = useNavigate();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPelicula, setSelectedPelicula] = useState(null);
    const [modal, modalContextHolder] = Modal.useModal();

    // Tema oscuro Netflix (Idéntico a CarteleraPage)
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: '#E50914',
            colorBgContainer: '#1a1a1a',
            colorBgElevated: '#1f1f1f',
            borderRadius: 8,
        },
    };

    // Verificar autenticación y cargar favoritos
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            navigate('/login');
            return;
        }
        const currentUser = JSON.parse(userJson);
        setUser(currentUser);
        cargarFavoritos(currentUser.id);
    }, [navigate]);

    // Cargar favoritos del usuario
    const cargarFavoritos = async (usuarioId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/usuarios/${usuarioId}/favoritos`);
            setFavoritos(response.data);
        } catch (error) {
            message.error('Error al cargar favoritos');
        } finally {
            setLoading(false);
        }
    };

    // Comprobar si es favorito
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

    // Abrir detalle
    const handleVerDetalle = (pelicula) => {
        setSelectedPelicula(pelicula);
        setModalVisible(true);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
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

                {/* ========== HEADER (Idéntico al de CarteleraPage) ========== */}
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
                            <button className="nav-btn" onClick={() => navigate('/cartelera')}>
                                Mejores Películas
                            </button>
                            <span className="text-gray-700 text-xl font-thin mx-2">|</span>
                            {/* Este botón está DESTACADO porque estamos en esta página */}
                            <button className="nav-btn active">
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
                    {/* Título de Sección */}
                    <div className="px-8 pt-10 pb-6">
                        <div className="flex items-center gap-3 mb-2 border-b border-zinc-700 pb-4">
                            <HeartFilled className="text-red-500 text-3xl" />
                            <h2 className="text-3xl font-bold text-white hover:text-red-600 cursor-pointer transition-colors tracking-wide">
                                Mis Películas Favoritas
                            </h2>
                        </div>
                    </div>

                    {/* Grid de Favoritos o Estado Vacío */}
                    <div className="px-8 pb-12">
                        {favoritos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Empty
                                    description={
                                        <span className="text-gray-500 text-lg">
                                            No tienes películas favoritas todavía
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
                                    Explorar Cartelera
                                </Button>
                            </div>
                        ) : (
                            /* Grid con el MISMO ESTILO de tarjetas que MovieRow */
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                                {favoritos.map((pelicula) => (
                                    <div
                                        key={pelicula.id}
                                        className="w-full aspect-[2/3] relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-10 group/card select-none shadow-lg hover:shadow-2xl hover:ring-2 hover:ring-white/20 cursor-pointer"
                                        onClick={() => handleVerDetalle(pelicula)}
                                    >
                                        <img
                                            src={pelicula.posterUrl || 'https://via.placeholder.com/200x300?text=Sin+Imagen'}
                                            alt={pelicula.titulo}
                                            className="w-full h-full object-cover pointer-events-none"
                                        />
                                        {/* Info Overlay (Idéntico a MovieRow) */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-2 text-center">
                                            <h4 className="text-white font-bold text-sm leading-tight mb-2 drop-shadow-md px-1 line-clamp-2">{pelicula.titulo}</h4>
                                            <div className="flex flex-col gap-2 mt-0 px-2 w-full">
                                                <Button
                                                    size="small"
                                                    icon={<DesktopOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVerDetalle(pelicula);
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
                                                    icon={isFavorito(pelicula.id) ? <HeartFilled /> : <HeartOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorito(pelicula);
                                                    }}
                                                    className={`w-full font-medium border-none shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-105 ${isFavorito(pelicula.id) ? 'hover:!bg-red-700' : 'hover:!bg-white hover:!text-black'}`}
                                                    style={{
                                                        backgroundColor: isFavorito(pelicula.id) ? '#E50914' : 'rgba(255, 255, 255, 0.75)',
                                                        color: isFavorito(pelicula.id) ? 'white' : '#333',
                                                        height: '32px'
                                                    }}
                                                >
                                                    {isFavorito(pelicula.id) ? 'Quitar Fav.' : 'Añadir Fav.'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="py-8 text-center text-gray-500 text-sm border-t border-[#1a1a1a]">
                        <p>© 2024 OFH CINEMA. Todos los derechos reservados.</p>
                    </footer>
                </div>

                {/* Modal de Detalles */}
                <MovieDetailModal
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    pelicula={selectedPelicula}
                    isFavorito={isFavorito}
                    toggleFavorito={toggleFavorito}
                />

                {/* ========== ESTILOS GLOBALES (Idénticos a CarteleraPage) ========== */}
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
                    .nav-btn:hover::after,
                    .nav-btn.active::after {
                        width: 100%;
                    }
                    .nav-btn.active {
                        color: #fff;
                    }

                    /* Botón destacado (Estilo Outline Suave) */
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

export default FavoritosPage;
