import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Rate,
    Space,
    Avatar,
    notification,
    List,
    Spin,
    DatePicker,
    InputNumber,
    Image,
    ConfigProvider,
    theme,
    Tag,
    Divider
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
    VideoCameraOutlined,
    UserOutlined,
    TeamOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    GlobalOutlined,
    CommentOutlined,
    ScheduleOutlined,
    SettingOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import logo from '../assets/logo.png';
import { searchMovies, getMovieDetails, searchPeople } from '../services/tmdb.service';

const { TextArea } = Input;
const { confirm } = Modal;

const API_URL = 'http://localhost:8081/api';

// Iconos de plataformas
const PLATFORM_ICONS = {
    'Netflix': '🎬',
    'HBO': '📺',
    'Disney+': '🏰',
    'Amazon Prime': '📦',
    'Cine': '🎥',
    'Apple TV': '🍎',
    'Movistar+': '📡'
};

const AdminPeliculasPage = () => {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    // Estados
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedPelicula, setSelectedPelicula] = useState(null);
    const [editingPelicula, setEditingPelicula] = useState(null);
    const [form] = Form.useForm();

    // Estados para búsqueda TMDB
    const [tmdbResults, setTmdbResults] = useState([]);
    const [tmdbLoading, setTmdbLoading] = useState(false);
    const [tmdbSearchQuery, setTmdbSearchQuery] = useState('');
    const [currentDirectorFotoUrl, setCurrentDirectorFotoUrl] = useState('');

    // Usuario actual
    const [user, setUser] = useState(null);

    // Sección activa
    const [activeSection, setActiveSection] = useState('peliculas');

    // Estados para directores
    const [directores, setDirectores] = useState([]);
    const [directorModalVisible, setDirectorModalVisible] = useState(false);
    const [directorDetailVisible, setDirectorDetailVisible] = useState(false);
    const [selectedDirector, setSelectedDirector] = useState(null);
    const [editingDirector, setEditingDirector] = useState(null);
    const [directorForm] = Form.useForm();
    const [tmdbDirectorResults, setTmdbDirectorResults] = useState([]);
    const [tmdbDirectorQuery, setTmdbDirectorQuery] = useState('');

    // Secciones del menú
    const menuSections = [
        { key: 'peliculas', label: 'Películas', icon: <VideoCameraOutlined /> },
        { key: 'directores', label: 'Directores', icon: <UserOutlined /> },
        { key: 'actores', label: 'Actores', icon: <TeamOutlined /> },
        { key: 'plataformas', label: 'Plataformas', icon: <PlayCircleOutlined /> },
        { key: 'idiomas', label: 'Idiomas', icon: <GlobalOutlined /> },
        { key: 'criticas', label: 'Críticas', icon: <CommentOutlined /> },
        { key: 'funciones', label: 'Funciones', icon: <ScheduleOutlined /> },
        { key: 'usuarios', label: 'Usuarios', icon: <SettingOutlined /> },
    ];

    // Verificar autenticación y rol admin
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.admin) {
            api.warning({
                message: 'Acceso denegado',
                description: 'No tienes permisos de administrador'
            });
            navigate('/cartelera');
            return;
        }

        setUser(parsedUser);
        cargarPeliculas();
    }, [navigate]);

    // Búsqueda TMDB en tiempo real con debounce
    useEffect(() => {
        if (!tmdbSearchQuery || tmdbSearchQuery.length < 2) {
            setTmdbResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setTmdbLoading(true);
            try {
                const results = await searchMovies(tmdbSearchQuery);
                setTmdbResults(results);
            } catch (error) {
                console.error('Error buscando en TMDB:', error);
            } finally {
                setTmdbLoading(false);
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [tmdbSearchQuery]);

    // Cargar películas del backend
    const cargarPeliculas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/peliculas`);
            setPeliculas(response.data);
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'No se pudieron cargar las películas'
            });
        } finally {
            setLoading(false);
        }
    };

    // Cargar directores del backend
    const cargarDirectores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/directores`);
            setDirectores(response.data);
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'No se pudieron cargar los directores'
            });
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos según sección activa
    useEffect(() => {
        if (activeSection === 'peliculas') {
            cargarPeliculas();
        } else if (activeSection === 'directores') {
            cargarDirectores();
        }
    }, [activeSection]);

    // Búsqueda TMDB para directores
    useEffect(() => {
        if (!tmdbDirectorQuery || tmdbDirectorQuery.length < 2) {
            setTmdbDirectorResults([]);
            return;
        }
        const timeoutId = setTimeout(async () => {
            try {
                const results = await searchPeople(tmdbDirectorQuery);
                setTmdbDirectorResults(results);
            } catch (error) {
                console.error('Error buscando directores:', error);
            }
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [tmdbDirectorQuery]);

    // CRUD Directores
    const handleNuevoDirector = () => {
        setEditingDirector(null);
        directorForm.resetFields();
        setTmdbDirectorQuery('');
        setTmdbDirectorResults([]);
        setDirectorModalVisible(true);
    };

    const handleVerDirector = (director) => {
        setSelectedDirector(director);
        setDirectorDetailVisible(true);
    };

    const handleEditarDirector = (director) => {
        setEditingDirector(director);
        setDirectorDetailVisible(false);
        directorForm.setFieldsValue({
            nombre: director.nombre,
            apellido: director.apellido,
            fotoUrl: director.fotoUrl
        });
        setDirectorModalVisible(true);
    };

    const handleEliminarDirector = (id, e) => {
        e?.stopPropagation();
        confirm({
            title: '¿Eliminar director?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/directores/${id}`);
                    api.success({ message: 'Director eliminado' });
                    cargarDirectores();
                } catch (error) {
                    api.error({ message: 'Error al eliminar', description: 'El director puede tener películas asociadas' });
                }
            }
        });
    };

    const handleGuardarDirector = async (values) => {
        try {
            const data = {
                nombre: values.nombre,
                apellido: values.apellido || '',
                fotoUrl: values.fotoUrl || ''
            };
            if (editingDirector) {
                await axios.put(`${API_URL}/directores/${editingDirector.id}`, data);
                api.success({ message: 'Director actualizado' });
            } else {
                await axios.post(`${API_URL}/directores`, data);
                api.success({ message: 'Director creado' });
            }
            setDirectorModalVisible(false);
            cargarDirectores();
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudo guardar el director' });
        }
    };

    const handleSelectTmdbDirector = (person) => {
        directorForm.setFieldsValue({
            nombre: person.nombre,
            apellido: person.apellido,
            fotoUrl: person.fotoUrl || ''
        });
        setTmdbDirectorQuery('');
        setTmdbDirectorResults([]);
        api.success({ message: 'Datos de TMDB cargados' });
    };

    // Columnas tabla directores
    const directorColumns = [
        {
            title: 'Foto',
            dataIndex: 'fotoUrl',
            key: 'foto',
            width: 90,
            render: (url) => (
                <Avatar
                    src={url}
                    size={60}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#333' }}
                />
            )
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => <span className="font-semibold text-white">{text}</span>
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
            render: (text) => <span className="text-gray-300">{text || '-'}</span>
        },
        {
            title: 'Películas',
            dataIndex: 'numeroPeliculas',
            key: 'numeroPeliculas',
            width: 120,
            render: (num) => <span className="text-gray-400">{num} películas</span>
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleEditarDirector(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarDirector(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('user');
        api.success({ message: 'Sesión cerrada' });
        setTimeout(() => navigate('/login'), 500);
    };

    // Abrir modal para nueva película
    const handleNuevaPelicula = () => {
        setEditingPelicula(null);
        form.resetFields();
        setTmdbSearchQuery('');
        setTmdbResults([]);
        setCurrentDirectorFotoUrl('');
        setModalVisible(true);
    };

    // Ver detalles de película
    const handleVerDetalles = (pelicula) => {
        setSelectedPelicula(pelicula);
        setDetailModalVisible(true);
    };

    // Abrir modal para editar
    const handleEditar = (pelicula) => {
        setEditingPelicula(pelicula);
        setDetailModalVisible(false);
        setTmdbSearchQuery('');
        setTmdbResults([]);
        form.setFieldsValue({
            titulo: pelicula.titulo,
            sinopsis: pelicula.sinopsis,
            duracion: pelicula.duracion,
            fechaEstreno: pelicula.fechaEstreno ? dayjs(pelicula.fechaEstreno) : null,
            valoracion: pelicula.valoracion,
            posterUrl: pelicula.posterUrl,
            directorNombre: pelicula.director?.nombre || '',
            actoresNombres: pelicula.actores?.map(a => a.nombre) || [],
            categoriasNombres: pelicula.categorias?.map(c => c.nombre) || [],
            plataformasNombres: pelicula.plataformas?.map(p => p.nombre) || []
        });
        setModalVisible(true);
    };

    // Eliminar película
    const handleEliminar = (id, e) => {
        e?.stopPropagation();
        confirm({
            title: '¿Eliminar película?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/peliculas/${id}`);
                    api.success({ message: 'Película eliminada' });
                    cargarPeliculas();
                } catch (error) {
                    api.error({ message: 'Error al eliminar' });
                }
            }
        });
    };

    // Guardar película (crear o actualizar)
    const handleGuardar = async (values) => {
        try {
            const data = {
                titulo: values.titulo,
                sinopsis: values.sinopsis,
                duracion: values.duracion,
                fechaEstreno: values.fechaEstreno?.format('YYYY-MM-DD'),
                valoracion: values.valoracion || 3,
                posterUrl: values.posterUrl,
                directorNombre: values.directorNombre,
                directorFotoUrl: currentDirectorFotoUrl,
                actoresNombres: values.actoresNombres || [],
                categoriasNombres: values.categoriasNombres || [],
                plataformasNombres: [] // Se generan automáticamente en el backend
            };

            if (editingPelicula) {
                await axios.put(`${API_URL}/peliculas/${editingPelicula.id}`, data);
                api.success({ message: 'Película actualizada correctamente' });
            } else {
                await axios.post(`${API_URL}/peliculas`, data);
                api.success({ message: 'Película creada correctamente' });
            }

            setModalVisible(false);
            cargarPeliculas();
        } catch (error) {
            console.error(error);
            api.error({
                message: 'Error',
                description: error.response?.data?.message || 'No se pudo guardar la película'
            });
        }
    };

    // Seleccionar película de TMDB
    const handleSelectTmdb = async (tmdbMovie) => {
        setTmdbLoading(true);
        try {
            const details = await getMovieDetails(tmdbMovie.id);

            form.setFieldsValue({
                titulo: details.titulo,
                sinopsis: details.sinopsis,
                duracion: details.duracion,
                fechaEstreno: details.fechaEstreno ? dayjs(details.fechaEstreno) : null,
                valoracion: details.valoracion,
                posterUrl: details.posterUrl,
                directorNombre: details.directorNombre,
                actoresNombres: details.actoresNombres,
                categoriasNombres: details.categoriasNombres,
                plataformasNombres: details.plataformasNombres
            });

            // Guardar la foto del director para enviarla al backend
            setCurrentDirectorFotoUrl(details.directorFotoUrl || '');

            api.success({ message: 'Datos de TMDB cargados' });
            setTmdbSearchQuery('');
            setTmdbResults([]);
        } catch (error) {
            api.error({ message: 'Error cargando detalles de TMDB' });
        } finally {
            setTmdbLoading(false);
        }
    };

    // Columnas de la tabla
    const columns = [
        {
            title: 'Título',
            dataIndex: 'titulo',
            key: 'titulo',
            render: (text) => <span className="font-semibold text-white">{text}</span>
        },
        {
            title: 'Director',
            dataIndex: 'director',
            key: 'director',
            render: (director) => <span className="text-gray-400">{director?.nombre || '-'}</span>
        },
        {
            title: 'Categorías',
            dataIndex: 'categorias',
            key: 'categorias',
            render: (categorias) => (
                <Space wrap size={[4, 4]}>
                    {categorias?.slice(0, 3).map((cat, i) => (
                        <Tag
                            key={i}
                            style={{
                                backgroundColor: '#2a2a2a',
                                borderColor: '#3a3a3a',
                                color: '#e0e0e0',
                                margin: 0
                            }}
                        >
                            {cat.nombre}
                        </Tag>
                    )) || <span className="text-gray-500">-</span>}
                </Space>
            )
        },
        {
            title: 'Duración',
            dataIndex: 'duracion',
            key: 'duracion',
            width: 100,
            render: (dur) => <span className="text-gray-400">{dur} min</span>
        },
        {
            title: 'Valoración',
            dataIndex: 'valoracion',
            key: 'valoracion',
            width: 140,
            render: (val) => <Rate disabled value={val} count={5} style={{ color: '#E50914', fontSize: '14px' }} />
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleEditar(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminar(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // Tema oscuro suave para Ant Design
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: '#E50914',
            colorBgContainer: '#1c1c1c',
            colorBgElevated: '#1c1c1c',
            colorBorder: '#2a2a2a',
            colorText: '#e5e5e5',
            colorTextSecondary: '#888',
            borderRadius: 6,
        },
    };

    // Obtener título de sección
    const getSectionTitle = () => {
        const section = menuSections.find(s => s.key === activeSection);
        return section ? `Gestión de ${section.label}` : '';
    };

    return (
        <ConfigProvider theme={darkTheme}>
            <div
                className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden"
                style={{ backgroundColor: '#0d0d0d' }}
            >
                {contextHolder}

                {/* Header */}
                <header
                    className="flex items-center justify-between px-8 shrink-0"
                    style={{ backgroundColor: '#0a0a0a', height: '72px', borderBottom: '1px solid #1a1a1a' }}
                >
                    {/* Logo y Panel de Control */}
                    <div className="flex items-center gap-6">
                        <img src={logo} alt="OFHCINEMA" className="h-19" />
                        <div className="h-8 w-px bg-gray-800"></div>
                        <span className="text-white text-2xl font-bold tracking-tight">Panel de Control</span>
                    </div>

                    {/* Usuario y Logout */}
                    <div className="flex items-center gap-5">
                        <div className="text-right">
                            <span className="text-gray-500 text-xs block">Usuario administrador</span>
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

                {/* Navegación de secciones - estilo subrayado */}
                <nav
                    className="flex items-center gap-2 px-10 py-4 shrink-0 overflow-x-auto"
                    style={{ backgroundColor: '#0f0f0f', borderBottom: '1px solid #2e2e2eff' }}
                >
                    {menuSections.map((section) => (
                        <button
                            key={section.key}
                            onClick={() => setActiveSection(section.key)}
                            className={`
                flex items-center gap-4 px-4 py-2 rounded-md transition-all duration-200
                ${activeSection === section.key
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                                }
              `}
                            style={activeSection === section.key ? {
                                backgroundColor: 'rgba(216, 58, 66, 0.1)',
                                borderBottom: '3px solid #e24a52ff',
                                borderRadius: '4px 4px 0 0'
                            } : {}}
                        >
                            {section.icon}
                            <span className="text-sm font-medium">{section.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Contenido principal */}
                <main className="flex-1 overflow-auto px-12 py-6">
                    {/* Título y botón nueva película */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-left">
                            <h1 className="text-lg font-semibold text-white mb-1">
                                {getSectionTitle()}
                            </h1>
                            {activeSection === 'peliculas' && (
                                <p className="text-gray-500 text-sm text-left">
                                    {peliculas.length} {peliculas.length === 1 ? 'película' : 'películas'} en total
                                </p>
                            )}
                            {activeSection === 'directores' && (
                                <p className="text-gray-500 text-sm text-left">
                                    {directores.length} {directores.length === 1 ? 'director' : 'directores'} en total
                                </p>
                            )}
                        </div>
                        {activeSection === 'peliculas' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevaPelicula}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nueva Película
                            </Button>
                        )}
                        {activeSection === 'directores' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevoDirector}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nuevo Director
                            </Button>
                        )}
                    </div>

                    {/* Indicador de click */}
                    {activeSection === 'peliculas' && (
                        <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs text-left">
                            <InfoCircleOutlined />
                            <span>Pulsa sobre una fila para ver más información</span>
                        </div>
                    )}

                    {/* Tabla de películas */}
                    {activeSection === 'peliculas' && (
                        <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                            <Table
                                columns={columns}
                                dataSource={peliculas}
                                rowKey="id"
                                loading={loading}
                                pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} películas` }}
                                onRow={(record) => ({
                                    onClick: () => handleVerDetalles(record),
                                    style: { cursor: 'pointer' }
                                })}
                                size="middle"
                            />
                        </div>
                    )}

                    {/* ============ SECCIÓN DIRECTORES ============ */}
                    {activeSection === 'directores' && (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs text-left">
                                <InfoCircleOutlined />
                                <span>Pulsa sobre una fila para ver más información</span>
                            </div>

                            <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                <Table
                                    columns={directorColumns}
                                    dataSource={directores}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} directores` }}
                                    onRow={(record) => ({
                                        onClick: () => handleVerDirector(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                    size="middle"
                                />
                            </div>
                        </>
                    )}

                    {/* Placeholder para otras secciones */}
                    {activeSection !== 'peliculas' && activeSection !== 'directores' && (
                        <div className="bg-[#151515] rounded-lg p-12 border border-[#222] text-center">
                            <div className="text-4xl mb-4">
                                {menuSections.find(s => s.key === activeSection)?.icon}
                            </div>
                            <p className="text-gray-500">
                                Sección de {menuSections.find(s => s.key === activeSection)?.label} - Próximamente
                            </p>
                        </div>
                    )}
                </main>

                {/* Modal de Detalles */}
                <Modal
                    title={null}
                    open={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={[
                        <Button
                            key="edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEditar(selectedPelicula)}
                            size="large"
                            style={{ borderColor: '#E50914', color: '#E50914' }}
                        >
                            Editar Película
                        </Button>,
                        <Button key="close" size="large" onClick={() => setDetailModalVisible(false)}>
                            Cerrar
                        </Button>
                    ]}
                    width={950}
                    centered
                >
                    {selectedPelicula && (
                        <div className="flex gap-8 py-2">
                            {/* Poster */}
                            {selectedPelicula.posterUrl && (
                                <div className="shrink-0">
                                    <Image
                                        src={selectedPelicula.posterUrl}
                                        alt={selectedPelicula.titulo}
                                        width={200}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 flex flex-col gap-5">
                                {/* Título */}
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {selectedPelicula.titulo}
                                    </h2>
                                    <p className="text-gray-400">
                                        Dirigida por <span className="text-white">{selectedPelicula.director?.nombre || 'Desconocido'}</span>
                                    </p>
                                </div>

                                {/* Info rápida */}
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <ClockCircleOutlined />
                                        <span>{selectedPelicula.duracion} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <CalendarOutlined />
                                        <span>{selectedPelicula.fechaEstreno || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Valoración:</span>
                                        <Rate
                                            disabled
                                            value={selectedPelicula.valoracion}
                                            count={5}
                                            style={{ color: '#E50914', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <Divider style={{ borderColor: '#333', margin: 0 }} />

                                {/* Sinopsis */}
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Sinopsis</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {selectedPelicula.sinopsis || 'Sin sinopsis disponible'}
                                    </p>
                                </div>

                                {/* Categorías y Plataformas en fila */}
                                <div className="flex gap-8">
                                    {/* Categorías */}
                                    <div className="flex-1">
                                        <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Categorías</h4>
                                        <Space wrap>
                                            {selectedPelicula.categorias?.map((cat, i) => (
                                                <Tag
                                                    key={i}
                                                    style={{
                                                        backgroundColor: '#E50914',
                                                        borderColor: '#E50914',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    {cat.nombre}
                                                </Tag>
                                            )) || <span className="text-gray-500">Sin categorías</span>}
                                        </Space>
                                    </div>

                                    {/* Plataformas */}
                                    <div className="flex-1">
                                        <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Disponible en</h4>
                                        <Space wrap>
                                            {selectedPelicula.plataformas?.map((plat, i) => (
                                                <Tag
                                                    key={i}
                                                    style={{
                                                        backgroundColor: '#1a1a1a',
                                                        borderColor: '#333',
                                                        color: '#fff',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    <span className="mr-1">{PLATFORM_ICONS[plat.nombre] || '📺'}</span>
                                                    {plat.nombre}
                                                </Tag>
                                            )) || <span className="text-gray-500">Sin plataformas</span>}
                                        </Space>
                                    </div>
                                </div>

                                {/* Idiomas */}
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Idiomas disponibles</h4>
                                    <Space wrap>
                                        {selectedPelicula.idiomas?.map((idioma, i) => (
                                            <Tag
                                                key={i}
                                                style={{
                                                    backgroundColor: '#1f3a5f',
                                                    borderColor: '#2a4a6f',
                                                    color: '#a8c8e8'
                                                }}
                                            >
                                                🌐 {idioma.nombre}
                                            </Tag>
                                        )) || <span className="text-gray-500">Sin idiomas</span>}
                                    </Space>
                                </div>

                                {/* Actores */}
                                <div>
                                    <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Reparto Principal</h4>
                                    <Space wrap>
                                        {selectedPelicula.actores?.slice(0, 5).map((act, i) => (
                                            <Tag
                                                key={i}
                                                style={{
                                                    backgroundColor: '#2a2a2a',
                                                    borderColor: '#3a3a3a',
                                                    color: '#e0e0e0'
                                                }}
                                            >
                                                {act.nombre}
                                            </Tag>
                                        )) || <span className="text-gray-500">Sin actores</span>}
                                    </Space>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal de Formulario */}
                <Modal
                    title={editingPelicula ? 'Editar Película' : 'Nueva Película'}
                    open={modalVisible}
                    onCancel={() => { setModalVisible(false); setTmdbResults([]); setTmdbSearchQuery(''); }}
                    footer={null}
                    width={950}
                    centered
                >
                    {/* Búsqueda TMDB - sin botón, búsqueda en tiempo real */}
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-2 block">Buscar en TMDB para auto-rellenar</label>
                        <Input
                            placeholder="Escribe el nombre de la película..."
                            value={tmdbSearchQuery}
                            onChange={(e) => setTmdbSearchQuery(e.target.value)}
                            prefix={<SearchOutlined className="text-gray-500" />}
                            suffix={tmdbLoading ? <Spin size="small" /> : null}
                            size="large"
                            allowClear
                        />
                    </div>

                    {/* Resultados TMDB alineados a la izquierda */}
                    {tmdbResults.length > 0 && (
                        <div
                            className="mb-6 max-h-48 overflow-y-auto rounded-lg border border-gray-700"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            <List
                                dataSource={tmdbResults}
                                renderItem={(movie) => (
                                    <List.Item
                                        className="cursor-pointer hover:bg-gray-800 px-4 py-3"
                                        onClick={() => handleSelectTmdb(movie)}
                                        style={{ borderColor: '#333', padding: '12px 16px' }}
                                    >
                                        <div className="flex items-center gap-4 w-full">
                                            <Avatar
                                                src={movie.posterUrl}
                                                shape="square"
                                                size={50}
                                                style={{ backgroundColor: '#333', flexShrink: 0 }}
                                            />
                                            <div className="text-left">
                                                <div className="text-white font-medium">{movie.titulo}</div>
                                                <div className="text-gray-500 text-sm">{movie.anio}</div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleGuardar}
                        requiredMark={false}
                    >
                        {/* Layout horizontal */}
                        <div className="flex gap-8">
                            {/* Columna izquierda */}
                            <div className="flex-1">
                                <Form.Item
                                    name="titulo"
                                    label="Título"
                                    rules={[{ required: true, message: 'El título es obligatorio' }]}
                                >
                                    <Input placeholder="Título de la película" />
                                </Form.Item>

                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item
                                        name="duracion"
                                        label="Duración (min)"
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                    >
                                        <InputNumber className="w-full" min={1} placeholder="120" />
                                    </Form.Item>
                                    <Form.Item
                                        name="fechaEstreno"
                                        label="Fecha de Estreno"
                                        rules={[{ required: true, message: 'Obligatorio' }]}
                                    >
                                        <DatePicker className="w-full" format="YYYY-MM-DD" />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    name="sinopsis"
                                    label="Sinopsis"
                                    rules={[{ required: true, message: 'La sinopsis es obligatoria' }]}
                                >
                                    <TextArea rows={4} placeholder="Descripción de la película..." />
                                </Form.Item>

                                <Form.Item name="directorNombre" label="Director">
                                    <Input placeholder="Nombre del director" />
                                </Form.Item>
                            </div>

                            {/* Columna derecha */}
                            <div className="flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item name="posterUrl" label="Poster URL">
                                        <Input placeholder="URL del poster" />
                                    </Form.Item>
                                    <Form.Item name="valoracion" label="Valoración">
                                        <Rate count={5} style={{ color: '#E50914' }} />
                                    </Form.Item>
                                </div>

                                {/* Preview del poster */}
                                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.posterUrl !== curr.posterUrl}>
                                    {({ getFieldValue }) => {
                                        const url = getFieldValue('posterUrl');
                                        return url ? (
                                            <div className="mb-4 flex justify-center">
                                                <Image
                                                    src={url}
                                                    alt="Preview"
                                                    width={100}
                                                    style={{ borderRadius: '6px' }}
                                                />
                                            </div>
                                        ) : null;
                                    }}
                                </Form.Item>

                                <Form.Item name="actoresNombres" label="Actores">
                                    <Select
                                        mode="tags"
                                        placeholder="Escribe nombres de actores"
                                        tokenSeparators={[',']}
                                    />
                                </Form.Item>

                                <Form.Item name="categoriasNombres" label="Categorías">
                                    <Select
                                        mode="tags"
                                        placeholder="Escribe categorías"
                                        tokenSeparators={[',']}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                            <Button onClick={() => { setModalVisible(false); setTmdbResults([]); setTmdbSearchQuery(''); }} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                {editingPelicula ? 'Actualizar' : 'Crear Película'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* ========== MODALES DIRECTORES ========== */}

                {/* Modal Detalle Director */}
                <Modal
                    title={null}
                    open={directorDetailVisible}
                    onCancel={() => setDirectorDetailVisible(false)}
                    footer={[
                        <Button
                            key="edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEditarDirector(selectedDirector)}
                            size="large"
                            style={{ borderColor: '#E50914', color: '#E50914' }}
                        >
                            Editar Director
                        </Button>,
                        <Button key="close" size="large" onClick={() => setDirectorDetailVisible(false)}>
                            Cerrar
                        </Button>
                    ]}
                    width={600}
                    centered
                >
                    {selectedDirector && (
                        <div className="flex gap-6 py-4">
                            {selectedDirector.fotoUrl && (
                                <div className="shrink-0">
                                    <Image
                                        src={selectedDirector.fotoUrl}
                                        alt={selectedDirector.nombreCompleto}
                                        width={150}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {selectedDirector.nombreCompleto}
                                </h2>
                                <Divider style={{ borderColor: '#333', margin: '16px 0' }} />
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Nombre</span>
                                        <p className="text-white">{selectedDirector.nombre}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Apellido</span>
                                        <p className="text-white">{selectedDirector.apellido || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Películas dirigidas</span>
                                        <p className="text-white">{selectedDirector.numeroPeliculas} películas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal Formulario Director */}
                <Modal
                    title={editingDirector ? 'Editar Director' : 'Nuevo Director'}
                    open={directorModalVisible}
                    onCancel={() => { setDirectorModalVisible(false); setTmdbDirectorResults([]); setTmdbDirectorQuery(''); }}
                    footer={null}
                    width={600}
                    centered
                >
                    {/* Búsqueda TMDB Directores */}
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-2 block">Buscar en TMDB para auto-rellenar</label>
                        <Input
                            placeholder="Escribe el nombre del director..."
                            value={tmdbDirectorQuery}
                            onChange={(e) => setTmdbDirectorQuery(e.target.value)}
                            prefix={<SearchOutlined className="text-gray-500" />}
                            size="large"
                            allowClear
                        />
                    </div>

                    {/* Resultados TMDB */}
                    {tmdbDirectorResults.length > 0 && (
                        <div
                            className="mb-6 max-h-48 overflow-y-auto rounded-lg border border-gray-700"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            <List
                                dataSource={tmdbDirectorResults}
                                renderItem={(person) => (
                                    <List.Item
                                        className="cursor-pointer hover:bg-gray-800 px-4 py-3"
                                        onClick={() => handleSelectTmdbDirector(person)}
                                        style={{ borderColor: '#333', padding: '12px 16px' }}
                                    >
                                        <div className="flex items-center gap-4 w-full">
                                            <Avatar
                                                src={person.fotoUrl}
                                                size={50}
                                                icon={<UserOutlined />}
                                                style={{ backgroundColor: '#333', flexShrink: 0 }}
                                            />
                                            <div className="text-left">
                                                <div className="text-white font-medium">{person.nombreCompleto}</div>
                                                <div className="text-gray-500 text-sm">Director</div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    <Form
                        form={directorForm}
                        layout="vertical"
                        onFinish={handleGuardarDirector}
                        requiredMark={false}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="nombre"
                                label="Nombre"
                                rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                            >
                                <Input placeholder="Nombre" />
                            </Form.Item>
                            <Form.Item name="apellido" label="Apellido">
                                <Input placeholder="Apellido" />
                            </Form.Item>
                        </div>

                        <Form.Item name="fotoUrl" label="URL de Foto">
                            <Input placeholder="URL de la foto" />
                        </Form.Item>

                        {/* Preview de foto */}
                        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.fotoUrl !== curr.fotoUrl}>
                            {({ getFieldValue }) => {
                                const url = getFieldValue('fotoUrl');
                                return url ? (
                                    <div className="mb-4 flex justify-center">
                                        <Image
                                            src={url}
                                            alt="Preview"
                                            width={100}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </div>
                                ) : null;
                            }}
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                            <Button onClick={() => { setDirectorModalVisible(false); setTmdbDirectorResults([]); setTmdbDirectorQuery(''); }} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                {editingDirector ? 'Actualizar' : 'Crear Director'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* Estilos para eliminar azul y usar rojo */}
                <style>{`
          /* Botón logout hover */
          .logout-btn:hover {
            background-color: #E50914 !important;
            border-color: #E50914 !important;
            color: #fff !important;
          }
          
          /* Navegación - quitar focus azul */
          nav button:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          nav button:hover {
            border-color: rgba(229, 9, 20, 0.5) !important;
          }
          
          /* Quitar outline azul en todos los inputs y botones */
          *:focus {
            outline-color: #E50914 !important;
          }
          
          /* Ant Design - botones focus */
          .ant-btn:focus,
          .ant-btn:focus-visible {
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.3) !important;
          }
          
          /* Ant Design - inputs focus */
          .ant-input:focus,
          .ant-input:hover,
          .ant-input-focused,
          .ant-picker:hover,
          .ant-picker-focused,
          .ant-input-number:hover,
          .ant-input-number:focus,
          .ant-input-number-focused,
          .ant-select:hover .ant-select-selector,
          .ant-select-focused .ant-select-selector {
            border-color: #E50914 !important;
            box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2) !important;
          }
          
          /* Ant Design - Select dropdown hover */
          .ant-select-item-option-active,
          .ant-select-item-option-selected {
            background-color: rgba(229, 9, 20, 0.2) !important;
          }
          
          /* Ant Design - Input Search button */
          .ant-input-search-button {
            background-color: #E50914 !important;
            border-color: #E50914 !important;
          }
          
          /* Ant Design - Pagination active */
          .ant-pagination-item-active {
            border-color: #E50914 !important;
          }
          .ant-pagination-item-active a {
            color: #E50914 !important;
          }
          
          /* Ant Design - DatePicker */
          .ant-picker-cell-selected .ant-picker-cell-inner {
            background-color: #E50914 !important;
          }
          .ant-picker-today-btn {
            color: #E50914 !important;
          }
          
          /* Ant Design - Tags seleccionados */
          .ant-select-selection-item {
            background-color: #333 !important;
            border-color: #555 !important;
          }
        `}</style>

            </div>
        </ConfigProvider>
    );
};

export default AdminPeliculasPage;
