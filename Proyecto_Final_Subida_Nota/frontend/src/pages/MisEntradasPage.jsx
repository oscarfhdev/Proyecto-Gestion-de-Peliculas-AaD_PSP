import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, ConfigProvider, theme, message, Empty, Modal, Tag } from 'antd';
import { LogoutOutlined, ShoppingCartOutlined, CloseCircleOutlined, CalendarOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import dayjs from 'dayjs';
import logo from '../assets/logo.png';

const MisEntradasPage = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, modalContextHolder] = Modal.useModal();

    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#E50914', colorBgContainer: '#1a1a1a', colorBgElevated: '#1f1f1f', borderRadius: 8 },
    };

    useEffect(() => { cargarVentas(); }, []);

    const cargarVentas = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/v1/ventas/mis-ventas');
            setVentas(res.data);
        } catch (error) {
            message.error('Error al cargar tus entradas');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = (ventaId) => {
        modal.confirm({
            title: '¿Cancelar esta compra?',
            icon: <ExclamationCircleOutlined />,
            content: 'Se cancelarán todas las entradas de esta venta. Esta acción no se puede deshacer.',
            okText: 'Sí, cancelar',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await api.put(`/api/v1/ventas/${ventaId}/cancelar`);
                    message.success('Venta cancelada correctamente');
                    cargarVentas();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Error al cancelar');
                }
            }
        });
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    if (loading) {
        return (<ConfigProvider theme={darkTheme}><div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><Spin size="large" /></div></ConfigProvider>);
    }

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
                {modalContextHolder}

                {/* HEADER */}
                <header className="flex items-center justify-between flex-wrap gap-y-1 px-3 sm:px-8 shrink-0" style={{ backgroundColor: '#0a0a0a', minHeight: '56px', borderBottom: '1px solid #1a1a1a' }}>
                    <div className="flex items-center gap-2 sm:gap-6">
                        <img src={logo} alt="OFHCINEMA" className="h-8 sm:h-12" />
                        <div className="h-8 w-px bg-gray-800 hidden sm:block"></div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button className="nav-btn" onClick={() => navigate('/cartelera')}>Inicio</button>
                            <span className="nav-separator text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn" onClick={() => navigate('/sesiones')}>Sesiones</button>
                            <span className="nav-separator text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn active">Mis Entradas</button>
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

                {/* CONTENIDO */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-8 pt-10 pb-6">
                        <div className="flex items-center gap-3 mb-2 border-b border-zinc-700 pb-4">
                            <ShoppingCartOutlined className="text-red-500 text-3xl" />
                            <h2 className="text-3xl font-bold text-white">🎟️ Mis Entradas y Compras</h2>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">Aquí puedes ver y gestionar todas tus compras.</p>
                    </div>

                    <div className="px-8 pb-12">
                        {ventas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Empty description={<span className="text-gray-500 text-lg">No tienes compras todavía</span>} />
                                <Button type="primary" size="large" onClick={() => navigate('/cartelera')} className="mt-6"
                                    style={{ backgroundColor: '#E50914', border: 'none' }}>
                                    Explorar Cartelera
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {ventas.map(venta => (
                                    <div key={venta.id} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-all">
                                        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-xl font-bold text-white">Compra #{venta.id}</h3>
                                                <Tag color={venta.estado === 'COMPLETADA' ? 'green' : venta.estado === 'CANCELADA' ? 'red' : 'orange'}>
                                                    {venta.estado}
                                                </Tag>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-green-400 text-2xl font-black">{venta.importeTotal?.toFixed(2)}€</span>
                                                {venta.estado === 'COMPLETADA' && (
                                                    <Button danger icon={<CloseCircleOutlined />} onClick={() => handleCancelar(venta.id)}
                                                        style={{ borderColor: '#E50914', color: '#E50914' }}>
                                                        Cancelar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-gray-400 text-sm mb-4">
                                            <span className="flex items-center gap-1"><CalendarOutlined /> {venta.fecha ? dayjs(venta.fecha).format('DD/MM/YYYY HH:mm') : 'N/A'}</span>
                                            <span>💳 {venta.metodoPago}</span>
                                        </div>

                                        {/* Entradas */}
                                        {venta.entradas && venta.entradas.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                                                {Array.from(venta.entradas).map(entrada => (
                                                    <div key={entrada.id} className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 flex flex-col gap-3">
                                                        <div className="flex gap-3">
                                                            {entrada.peliculaPoster ? (
                                                                <img src={entrada.peliculaPoster} alt={entrada.peliculaTitulo} className="w-16 h-24 object-cover rounded-md shadow-sm" />
                                                            ) : (
                                                                <div className="w-16 h-24 bg-zinc-900 rounded-md flex items-center justify-center text-xs text-gray-600 text-center p-1">Sin Poster</div>
                                                            )}
                                                            <div className="flex-1 flex flex-col justify-between">
                                                                <div>
                                                                    <h4 className="text-white font-bold text-sm line-clamp-1">{entrada.peliculaTitulo || 'Película N/A'}</h4>
                                                                    <div className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                                                                        <ClockCircleOutlined /> {entrada.fechaHoraFuncion ? dayjs(entrada.fechaHoraFuncion).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                                                    </div>
                                                                    <div className="text-gray-400 text-xs mt-1">
                                                                        📍 {entrada.salaNombre || 'Sala N/A'}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-2">
                                                                    <div>
                                                                        <span className="text-white font-mono font-bold text-xs bg-black px-2 py-1 rounded">🎫 {entrada.codigo}</span>
                                                                        <span className="text-gray-300 text-xs ml-2 font-medium">Fila {entrada.fila} • Asiento {entrada.asiento}</span>
                                                                    </div>
                                                                    <Tag color={entrada.estado === 'VENDIDA' ? 'blue' : entrada.estado === 'CANCELADA' ? 'red' : 'default'} className="m-0">
                                                                        {entrada.estado}
                                                                    </Tag>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <footer className="py-8 text-center text-gray-500 text-sm border-t border-[#1a1a1a]">
                        <p>© 2025 OFH CINEMA. Todos los derechos reservados.</p>
                    </footer>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default MisEntradasPage;
