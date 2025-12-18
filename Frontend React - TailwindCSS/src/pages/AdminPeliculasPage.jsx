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
    TimePicker,
    InputNumber,
    Image,
    ConfigProvider,
    theme,
    Tag,
    Divider,
    Checkbox
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
    PlayCircleOutlined,
    MailOutlined,
    LockOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import logo from '../assets/logo.png';
import { searchMovies, getMovieDetails, searchPeople, searchActors } from '../services/tmdb.service';

const { TextArea } = Input;

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
    const [modal, modalContextHolder] = Modal.useModal();

    // Estados
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados de búsqueda
    const [searchPeliculas, setSearchPeliculas] = useState('');
    const [searchDirectores, setSearchDirectores] = useState('');
    const [searchActores, setSearchActores] = useState('');
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
    const [currentActoresData, setCurrentActoresData] = useState([]);

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

    // Estados para actores
    const [actores, setActores] = useState([]);
    const [actorModalVisible, setActorModalVisible] = useState(false);
    const [actorDetailVisible, setActorDetailVisible] = useState(false);
    const [selectedActor, setSelectedActor] = useState(null);
    const [editingActor, setEditingActor] = useState(null);
    const [actorForm] = Form.useForm();
    const [tmdbActorResults, setTmdbActorResults] = useState([]);
    const [tmdbActorQuery, setTmdbActorQuery] = useState('');

    // Estados para plataformas
    const [plataformas, setPlataformas] = useState([]);
    const [plataformaModalVisible, setPlataformaModalVisible] = useState(false);
    const [plataformaDetailVisible, setPlataformaDetailVisible] = useState(false);
    const [selectedPlataforma, setSelectedPlataforma] = useState(null);
    const [editingPlataforma, setEditingPlataforma] = useState(null);
    const [plataformaForm] = Form.useForm();

    // Estados para idiomas
    const [idiomas, setIdiomas] = useState([]);
    const [idiomaModalVisible, setIdiomaModalVisible] = useState(false);
    const [idiomaDetailVisible, setIdiomaDetailVisible] = useState(false);
    const [selectedIdioma, setSelectedIdioma] = useState(null);
    const [editingIdioma, setEditingIdioma] = useState(null);
    const [idiomaForm] = Form.useForm();

    // Estados para críticas
    const [criticas, setCriticas] = useState([]);
    const [criticaModalVisible, setCriticaModalVisible] = useState(false);
    const [criticaDetailVisible, setCriticaDetailVisible] = useState(false);
    const [selectedCritica, setSelectedCritica] = useState(null);
    const [editingCritica, setEditingCritica] = useState(null);
    const [criticaForm] = Form.useForm();

    // Estados para usuarios
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioModalVisible, setUsuarioModalVisible] = useState(false);
    const [usuarioDetailVisible, setUsuarioDetailVisible] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [editingUsuario, setEditingUsuario] = useState(null);
    const [usuarioForm] = Form.useForm();

    // Estados para funciones y salas
    const [funciones, setFunciones] = useState([]);
    const [salas, setSalas] = useState([]);
    const [viewFuncionesSubSection, setViewFuncionesSubSection] = useState('funciones'); // 'funciones' | 'salas'

    // Estados Funciones
    const [funcionModalVisible, setFuncionModalVisible] = useState(false);
    const [funcionDetailVisible, setFuncionDetailVisible] = useState(false);
    const [selectedFuncion, setSelectedFuncion] = useState(null);
    const [editingFuncion, setEditingFuncion] = useState(null);
    const [funcionForm] = Form.useForm();

    // Estados Salas
    const [salaModalVisible, setSalaModalVisible] = useState(false);
    const [salaDetailVisible, setSalaDetailVisible] = useState(false);
    const [selectedSala, setSelectedSala] = useState(null);
    const [editingSala, setEditingSala] = useState(null);
    const [salaForm] = Form.useForm();

    // Secciones del menú
    const menuSections = [
        { key: 'peliculas', label: 'Películas', icon: <VideoCameraOutlined /> },
        { key: 'directores', label: 'Directores', icon: <UserOutlined /> },
        { key: 'actores', label: 'Actores', icon: <TeamOutlined /> },
        { key: 'plataformas', label: 'Plataformas', icon: <PlayCircleOutlined /> },
        { key: 'idiomas', label: 'Idiomas', icon: <GlobalOutlined /> },
        { key: 'criticas', label: 'Críticas', icon: <CommentOutlined /> },
        { key: 'funciones', label: 'Funciones y Salas', icon: <ScheduleOutlined /> },
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
        } else if (activeSection === 'actores') {
            cargarActores();
        } else if (activeSection === 'plataformas') {
            cargarPlataformas();
        } else if (activeSection === 'idiomas') {
            cargarIdiomas();
        } else if (activeSection === 'criticas') {
            cargarCriticas();
        } else if (activeSection === 'usuarios') {
            cargarUsuarios();
        } else if (activeSection === 'funciones') {
            cargarFunciones();
            cargarSalas();
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
        modal.confirm({
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

    // ========== FUNCIONES CRUD ACTORES ==========

    // Cargar actores del backend
    const cargarActores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/actores`);
            setActores(response.data);
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudieron cargar los actores' });
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda TMDB para actores
    useEffect(() => {
        if (!tmdbActorQuery || tmdbActorQuery.length < 2) {
            setTmdbActorResults([]);
            return;
        }
        const timeoutId = setTimeout(async () => {
            try {
                const results = await searchActors(tmdbActorQuery);
                setTmdbActorResults(results);
            } catch (error) {
                console.error('Error buscando actores:', error);
            }
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [tmdbActorQuery]);

    const handleNuevoActor = () => {
        setEditingActor(null);
        actorForm.resetFields();
        setTmdbActorQuery('');
        setTmdbActorResults([]);
        setActorModalVisible(true);
    };

    const handleVerActor = (actor) => {
        setSelectedActor(actor);
        setActorDetailVisible(true);
    };

    const handleEditarActor = (actor) => {
        setEditingActor(actor);
        setActorDetailVisible(false);
        actorForm.setFieldsValue({
            nombre: actor.nombre,
            apellido: actor.apellido,
            fotoUrl: actor.fotoUrl
        });
        setActorModalVisible(true);
    };

    const handleEliminarActor = (id, e) => {
        e?.stopPropagation();
        modal.confirm({
            title: '¿Eliminar actor?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/actores/${id}`);
                    api.success({ message: 'Actor eliminado' });
                    cargarActores();
                } catch (error) {
                    api.error({ message: 'Error al eliminar', description: 'El actor puede tener películas asociadas' });
                }
            }
        });
    };

    const handleGuardarActor = async (values) => {
        try {
            const data = {
                nombre: values.nombre,
                apellido: values.apellido || '',
                fotoUrl: values.fotoUrl || ''
            };
            if (editingActor) {
                await axios.put(`${API_URL}/actores/${editingActor.id}`, data);
                api.success({ message: 'Actor actualizado' });
            } else {
                await axios.post(`${API_URL}/actores`, data);
                api.success({ message: 'Actor creado' });
            }
            setActorModalVisible(false);
            cargarActores();
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudo guardar el actor' });
        }
    };

    const handleSelectTmdbActor = (person) => {
        actorForm.setFieldsValue({
            nombre: person.nombre,
            apellido: person.apellido,
            fotoUrl: person.fotoUrl || ''
        });
        setTmdbActorQuery('');
        setTmdbActorResults([]);
        api.success({ message: 'Datos de TMDB cargados' });
    };

    // Columnas tabla actores
    const actorColumns = [
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
                        onClick={(e) => { e.stopPropagation(); handleEditarActor(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarActor(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // ========== FUNCIONES CRUD PLATAFORMAS ==========

    // Cargar plataformas del backend
    const cargarPlataformas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/plataformas`);
            setPlataformas(response.data);
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudieron cargar las plataformas' });
        } finally {
            setLoading(false);
        }
    };

    const handleNuevaPlataforma = () => {
        setEditingPlataforma(null);
        plataformaForm.resetFields();
        setPlataformaModalVisible(true);
    };

    const handleVerPlataforma = (plataforma) => {
        setSelectedPlataforma(plataforma);
        setPlataformaDetailVisible(true);
    };

    const handleEditarPlataforma = (plataforma) => {
        setEditingPlataforma(plataforma);
        setPlataformaDetailVisible(false);
        plataformaForm.setFieldsValue({
            nombre: plataforma.nombre,
            url: plataforma.url
        });
        setPlataformaModalVisible(true);
    };

    const handleEliminarPlataforma = (id, e) => {
        e?.stopPropagation();
        modal.confirm({
            title: '¿Eliminar plataforma?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/plataformas/${id}`);
                    api.success({ message: 'Plataforma eliminada' });
                    cargarPlataformas();
                } catch (error) {
                    api.error({ message: 'Error al eliminar', description: 'La plataforma puede tener películas asociadas' });
                }
            }
        });
    };

    const handleGuardarPlataforma = async (values) => {
        try {
            const data = {
                nombre: values.nombre,
                url: values.url || ''
            };
            if (editingPlataforma) {
                await axios.put(`${API_URL}/plataformas/${editingPlataforma.id}`, data);
                api.success({ message: 'Plataforma actualizada' });
            } else {
                await axios.post(`${API_URL}/plataformas`, data);
                api.success({ message: 'Plataforma creada' });
            }
            setPlataformaModalVisible(false);
            cargarPlataformas();
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudo guardar la plataforma' });
        }
    };

    // Columnas tabla plataformas
    const plataformaColumns = [
        {
            title: 'Logo',
            dataIndex: 'url',
            key: 'logo',
            width: 120,
            render: (url) => (
                url ? (
                    <img
                        src={url}
                        alt="Logo"
                        style={{ maxWidth: 80, maxHeight: 40, objectFit: 'contain' }}
                    />
                ) : (
                    <Avatar
                        size={40}
                        icon={<PlayCircleOutlined />}
                        style={{ backgroundColor: '#333' }}
                    />
                )
            )
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => <span className="font-semibold text-white">{text}</span>
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
                        onClick={(e) => { e.stopPropagation(); handleEditarPlataforma(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarPlataforma(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // ========== FUNCIONES CRUD IDIOMAS ==========

    // Cargar idiomas del backend
    const cargarIdiomas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/idiomas`);
            setIdiomas(response.data);
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudieron cargar los idiomas' });
        } finally {
            setLoading(false);
        }
    };

    const handleNuevoIdioma = () => {
        setEditingIdioma(null);
        idiomaForm.resetFields();
        setIdiomaModalVisible(true);
    };

    const handleVerIdioma = (idioma) => {
        setSelectedIdioma(idioma);
        setIdiomaDetailVisible(true);
    };

    const handleEditarIdioma = (idioma) => {
        setEditingIdioma(idioma);
        setIdiomaDetailVisible(false);
        idiomaForm.setFieldsValue({
            nombre: idioma.nombre
        });
        setIdiomaModalVisible(true);
    };

    const handleEliminarIdioma = (id, e) => {
        e?.stopPropagation();
        modal.confirm({
            title: '¿Eliminar idioma?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/idiomas/${id}`);
                    api.success({ message: 'Idioma eliminado' });
                    cargarIdiomas();
                } catch (error) {
                    api.error({ message: 'Error al eliminar', description: 'El idioma puede tener películas asociadas' });
                }
            }
        });
    };

    const handleGuardarIdioma = async (values) => {
        try {
            const data = {
                nombre: values.nombre
            };
            if (editingIdioma) {
                await axios.put(`${API_URL}/idiomas/${editingIdioma.id}`, data);
                api.success({ message: 'Idioma actualizado' });
            } else {
                await axios.post(`${API_URL}/idiomas`, data);
                api.success({ message: 'Idioma creado' });
            }
            setIdiomaModalVisible(false);
            cargarIdiomas();
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudo guardar el idioma' });
        }
    };

    // Columnas tabla idiomas
    const idiomaColumns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text) => <span className="font-semibold text-white">{text}</span>
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
                        onClick={(e) => { e.stopPropagation(); handleEditarIdioma(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarIdioma(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // ========== FUNCIONES CRUD CRÍTICAS ==========

    const cargarCriticas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/criticas`);
            setCriticas(response.data);
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudieron cargar las críticas' });
        } finally {
            setLoading(false);
        }
    };

    const handleNuevaCritica = () => {
        setEditingCritica(null);
        criticaForm.resetFields();
        setCriticaModalVisible(true);
    };

    const handleVerCritica = (critica) => {
        setSelectedCritica(critica);
        setCriticaDetailVisible(true);
    };

    const handleEditarCritica = (critica) => {
        setEditingCritica(critica);
        setCriticaDetailVisible(false);
        criticaForm.setFieldsValue({
            comentario: critica.comentario,
            nota: critica.nota,
            autor: critica.autor,
            peliculaId: peliculas.find(p => p.titulo === critica.peliculaTitulo)?.id
        });
        setCriticaModalVisible(true);
    };

    const handleEliminarCritica = (id, e) => {
        e?.stopPropagation();
        modal.confirm({
            title: '¿Eliminar crítica?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/criticas/${id}`);
                    api.success({ message: 'Crítica eliminada' });
                    cargarCriticas();
                } catch (error) {
                    api.error({ message: 'Error al eliminar' });
                }
            }
        });
    };

    const handleGuardarCritica = async (values) => {
        try {
            const data = {
                comentario: values.comentario,
                nota: values.nota,
                autor: values.autor,
                peliculaId: values.peliculaId
            };
            if (editingCritica) {
                await axios.put(`${API_URL}/criticas/${editingCritica.id}`, data);
                api.success({ message: 'Crítica actualizada' });
            } else {
                await axios.post(`${API_URL}/criticas`, data);
                api.success({ message: 'Crítica creada' });
            }
            setCriticaModalVisible(false);
            cargarCriticas();
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudo guardar la crítica' });
        }
    };

    // Columnas tabla críticas
    const criticaColumns = [
        {
            title: 'Película',
            dataIndex: 'peliculaTitulo',
            key: 'peliculaTitulo',
            render: (text) => <span className="font-semibold text-white">{text}</span>
        },
        {
            title: 'Autor',
            dataIndex: 'autor',
            key: 'autor',
            render: (text) => <span className="text-gray-300">{text}</span>
        },
        {
            title: 'Puntuación',
            dataIndex: 'nota',
            key: 'nota',
            width: 120,
            render: (nota) => (
                <span className="text-yellow-400 font-bold">
                    ⭐ {nota?.toFixed(1) || '-'}
                </span>
            )
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
                        onClick={(e) => { e.stopPropagation(); handleEditarCritica(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarCritica(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // ========== FUNCIONES CRUD SALAS ==========

    const cargarSalas = async () => {
        try {
            const response = await axios.get(`${API_URL}/salas`);
            const sortedSalas = response.data.sort((a, b) => a.numeroSala - b.numeroSala);
            setSalas(sortedSalas);
        } catch (error) {
            api.error({ message: 'Error al cargar salas' });
        }
    };

    const handleNuevaSala = () => {
        setEditingSala(null);
        salaForm.resetFields();
        setSalaModalVisible(true);
    };

    const handleEditarSala = (sala) => {
        setEditingSala(sala);
        salaForm.setFieldsValue(sala);
        setSalaModalVisible(true);
    };

    const handleEliminarSala = (id, e) => {
        e?.stopPropagation();
        modal.confirm({
            title: '¿Eliminar sala?',
            content: 'Se eliminarán también las funciones asociadas',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/salas/${id}`);
                    api.success({ message: 'Sala eliminada' });
                    cargarSalas();
                } catch (error) {
                    api.error({ message: 'Error al eliminar sala' });
                }
            }
        });
    };

    const handleGuardarSala = async (values) => {
        try {
            if (editingSala) {
                await axios.put(`${API_URL}/salas/${editingSala.id}`, values);
                api.success({ message: 'Sala actualizada' });
            } else {
                await axios.post(`${API_URL}/salas`, values);
                api.success({ message: 'Sala creada' });
            }
            setSalaModalVisible(false);
            cargarSalas();
        } catch (error) {
            api.error({ message: 'Error al guardar sala' });
        }
    };

    const salaColumns = [
        {
            title: 'Sala',
            dataIndex: 'numeroSala',
            key: 'numeroSala',
            render: (text) => <span className="font-bold text-white">Sala {text}</span>
        },
        {
            title: 'Capacidad',
            dataIndex: 'capacidad',
            key: 'capacidad',
            render: (text) => <span className="text-gray-300">{text} butacas</span>
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
                        onClick={(e) => { e.stopPropagation(); handleEditarSala(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarSala(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // ========== FUNCIONES CRUD FUNCIONES ==========

    const cargarFunciones = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/funciones`);
            setFunciones(response.data);
        } catch (error) {
            api.error({ message: 'Error al cargar funciones' });
        } finally {
            setLoading(false);
        }
    };

    const handleNuevaFuncion = () => {
        setEditingFuncion(null);
        funcionForm.resetFields();
        setFuncionModalVisible(true);
    };

    const handleEditarFuncion = (funcion) => {
        setEditingFuncion(funcion);
        // Preparar valores para el form (fechas a dayjs)
        funcionForm.setFieldsValue({
            peliculaId: funcion.pelicula.id,
            salaId: funcion.sala.id,
            fecha: dayjs(funcion.fecha),
            hora: dayjs(funcion.hora, 'HH:mm:ss'),
            precio: funcion.precio,
            formato: funcion.formato
        });
        setFuncionModalVisible(true);
    };

    const handleEliminarFuncion = (id, e) => {
        e?.stopPropagation();
        modal.confirm({
            title: '¿Eliminar función?',
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/funciones/${id}`);
                    api.success({ message: 'Función eliminada' });
                    cargarFunciones();
                } catch (error) {
                    api.error({ message: 'Error al eliminar función' });
                }
            }
        });
    };

    const handleGuardarFuncion = async (values) => {
        try {
            const data = {
                peliculaId: values.peliculaId,
                salaId: values.salaId,
                fecha: values.fecha.format('YYYY-MM-DD'),
                hora: values.hora.format('HH:mm:ss'),
                precio: values.precio,
                formato: values.formato
            };

            if (editingFuncion) {
                await axios.put(`${API_URL}/funciones/${editingFuncion.id}`, data);
                api.success({ message: 'Función actualizada' });
            } else {
                await axios.post(`${API_URL}/funciones`, data);
                api.success({ message: 'Función creada' });
            }
            setFuncionModalVisible(false);
            cargarFunciones();
        } catch (error) {
            api.error({ message: 'Error al guardar función' });
        }
    };

    const funcionColumns = [
        {
            title: 'Película',
            dataIndex: ['pelicula', 'titulo'], // Nested
            key: 'pelicula',
            render: (text) => <span className="font-semibold text-white">{text}</span>
        },
        {
            title: 'Sala',
            dataIndex: ['sala', 'numeroSala'],
            key: 'sala',
            render: (text) => <span className="text-gray-300">Sala {text}</span>
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
            render: (text) => <span className="text-gray-300">{dayjs(text).format('DD/MM/YYYY')}</span>
        },
        {
            title: 'Hora',
            dataIndex: 'hora',
            key: 'hora',
            render: (text) => <span className="text-gray-300">{text}</span>
        },
        {
            title: 'Formato',
            dataIndex: 'formato',
            key: 'formato',
            render: (text) => (
                <Tag color={text === 'IMAX' ? 'gold' : text === '3D' ? 'cyan' : 'blue'}>
                    {text}
                </Tag>
            )
        },
        {
            title: 'Precio',
            dataIndex: 'precio',
            key: 'precio',
            render: (text) => <span className="text-green-400">{text} €</span>
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => { e.stopPropagation(); handleEditarFuncion(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarFuncion(record.id, e)}
                        style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }}
                    />
                </Space>
            )
        }
    ];

    // ========== FUNCIONES CRUD USUARIOS ==========

    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/usuarios`);
            setUsuarios(response.data);
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudieron cargar los usuarios' });
        } finally {
            setLoading(false);
        }
    };

    const handleNuevoUsuario = () => {
        setEditingUsuario(null);
        usuarioForm.resetFields();
        setUsuarioModalVisible(true);
    };

    const handleVerUsuario = (usuario) => {
        setSelectedUsuario(usuario);
        setUsuarioDetailVisible(true);
    };

    const handleEditarUsuario = (usuario) => {
        setEditingUsuario(usuario);
        setUsuarioDetailVisible(false);
        usuarioForm.setFieldsValue({
            username: usuario.username,
            email: usuario.email,
            password: usuario.password,
            admin: usuario.admin
        });
        setUsuarioModalVisible(true);
    };

    const handleEliminarUsuario = (id, e) => {
        e?.stopPropagation();
        // No permitir eliminarse a sí mismo
        if (id === user?.id) {
            api.warning({ message: 'No puedes eliminarte a ti mismo' });
            return;
        }
        modal.confirm({
            title: '¿Eliminar usuario?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await axios.delete(`${API_URL}/usuarios/${id}`);
                    api.success({ message: 'Usuario eliminado' });
                    cargarUsuarios();
                } catch (error) {
                    api.error({ message: 'Error al eliminar' });
                }
            }
        });
    };

    const handleGuardarUsuario = async (values) => {
        try {
            const data = {
                username: values.username,
                email: values.email,
                password: values.password,
                admin: values.admin || false
            };
            if (editingUsuario) {
                await axios.put(`${API_URL}/usuarios/${editingUsuario.id}`, data);
                api.success({ message: 'Usuario actualizado' });
            } else {
                await axios.post(`${API_URL}/usuarios`, data);
                api.success({ message: 'Usuario creado' });
            }
            setUsuarioModalVisible(false);
            cargarUsuarios();
        } catch (error) {
            api.error({ message: 'Error', description: 'No se pudo guardar el usuario' });
        }
    };

    const handleToggleAdmin = async (usuario, checked) => {
        // No permitir cambiarse a sí mismo
        if (usuario.id === user?.id) {
            api.warning({ message: 'No puedes cambiar tu propio rol de admin' });
            return;
        }
        try {
            await axios.put(`${API_URL}/usuarios/${usuario.id}`, {
                username: usuario.username,
                email: usuario.email,
                password: usuario.password,
                admin: checked
            });
            api.success({ message: checked ? 'Admin activado' : 'Admin desactivado' });
            cargarUsuarios();
        } catch (error) {
            api.error({ message: 'Error al cambiar rol' });
        }
    };

    // Columnas tabla usuarios
    const usuarioColumns = [
        {
            title: 'Usuario',
            dataIndex: 'username',
            key: 'username',
            render: (text) => <span className="font-semibold text-white">{text}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <span className="text-gray-300">{text}</span>
        },
        {
            title: 'Contraseña',
            dataIndex: 'password',
            key: 'password',
            render: (text) => <span className="text-gray-400 font-mono text-sm">{text}</span>
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            key: 'admin',
            width: 100,
            render: (isAdmin, record) => (
                <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => handleToggleAdmin(record, e.target.checked)}
                    disabled={record.id === user?.id}
                    className="w-5 h-5 accent-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => e.stopPropagation()}
                />
            )
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
                        onClick={(e) => { e.stopPropagation(); handleEditarUsuario(record); }}
                        style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }}
                    />
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleEliminarUsuario(record.id, e)}
                        disabled={record.id === user?.id}
                        style={{
                            backgroundColor: 'transparent',
                            color: record.id === user?.id ? '#555' : '#E50914',
                            borderColor: record.id === user?.id ? '#555' : '#E50914'
                        }}
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
        setCurrentActoresData([]);
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
        modal.confirm({
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
                actoresData: currentActoresData.length > 0 ? currentActoresData : null,
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
            // Guardar datos de actores con fotos para enviarlos al backend
            setCurrentActoresData(details.actoresData || []);

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
                {modalContextHolder}

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
                            {activeSection === 'actores' && (
                                <p className="text-gray-500 text-sm text-left">
                                    {actores.length} {actores.length === 1 ? 'actor' : 'actores'} en total
                                </p>
                            )}
                            {activeSection === 'plataformas' && (
                                <p className="text-gray-500 text-sm text-left">
                                    {plataformas.length} {plataformas.length === 1 ? 'plataforma' : 'plataformas'} en total
                                </p>
                            )}
                            {activeSection === 'idiomas' && (
                                <p className="text-gray-500 text-sm text-left">
                                    {idiomas.length} {idiomas.length === 1 ? 'idioma' : 'idiomas'} en total
                                </p>
                            )}
                            {activeSection === 'criticas' && (
                                <p className="text-gray-500 text-sm text-left">
                                    {criticas.length} {criticas.length === 1 ? 'crítica' : 'críticas'} en total
                                </p>
                            )}
                            {activeSection === 'usuarios' && (
                                <p className="text-gray-500 text-sm text-left">
                                    {usuarios.length} {usuarios.length === 1 ? 'usuario' : 'usuarios'} en total
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
                        {activeSection === 'actores' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevoActor}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nuevo Actor
                            </Button>
                        )}
                        {activeSection === 'plataformas' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevaPlataforma}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nueva Plataforma
                            </Button>
                        )}
                        {activeSection === 'idiomas' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevoIdioma}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nuevo Idioma
                            </Button>
                        )}
                        {activeSection === 'criticas' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevaCritica}
                                size="large"
                            >
                                Nueva Crítica
                            </Button>
                        )}
                        {activeSection === 'usuarios' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevoUsuario}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nuevo Usuario
                            </Button>
                        )}
                        {activeSection === 'funciones' && viewFuncionesSubSection === 'funciones' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevaFuncion}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nueva Función
                            </Button>
                        )}
                        {activeSection === 'funciones' && viewFuncionesSubSection === 'salas' && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNuevaSala}
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                Nueva Sala
                            </Button>
                        )}
                    </div>

                    {/* Barra de búsqueda dinámica */}
                    {(activeSection === 'peliculas' || activeSection === 'directores' || activeSection === 'actores') && (
                        <div className="mb-4">
                            <Input
                                placeholder={
                                    activeSection === 'peliculas' ? 'Buscar por título...' :
                                        activeSection === 'directores' ? 'Buscar por nombre o apellido...' :
                                            'Buscar por nombre o apellido...'
                                }
                                prefix={<SearchOutlined style={{ color: '#666' }} />}
                                value={
                                    activeSection === 'peliculas' ? searchPeliculas :
                                        activeSection === 'directores' ? searchDirectores :
                                            searchActores
                                }
                                onChange={(e) => {
                                    if (activeSection === 'peliculas') setSearchPeliculas(e.target.value);
                                    else if (activeSection === 'directores') setSearchDirectores(e.target.value);
                                    else setSearchActores(e.target.value);
                                }}
                                allowClear
                                size="large"
                                style={{
                                    width: '50%',
                                    backgroundColor: '#1a1a1a',
                                    borderColor: '#333'
                                }}
                            />
                        </div>
                    )}

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
                                dataSource={peliculas.filter(p =>
                                    p.titulo?.toLowerCase().includes(searchPeliculas.toLowerCase())
                                )}
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
                                    dataSource={directores.filter(d => {
                                        const search = searchDirectores.toLowerCase();
                                        return d.nombre?.toLowerCase().includes(search) ||
                                            d.apellido?.toLowerCase().includes(search) ||
                                            d.nombreCompleto?.toLowerCase().includes(search);
                                    })}
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

                    {/* ============ SECCIÓN ACTORES ============ */}
                    {activeSection === 'actores' && (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs text-left">
                                <InfoCircleOutlined />
                                <span>Pulsa sobre una fila para ver más información</span>
                            </div>

                            <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                <Table
                                    columns={actorColumns}
                                    dataSource={actores.filter(a => {
                                        const search = searchActores.toLowerCase();
                                        return a.nombre?.toLowerCase().includes(search) ||
                                            a.apellido?.toLowerCase().includes(search) ||
                                            a.nombreCompleto?.toLowerCase().includes(search);
                                    })}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} actores` }}
                                    onRow={(record) => ({
                                        onClick: () => handleVerActor(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                    size="middle"
                                />
                            </div>
                        </>
                    )}

                    {/* ============ SECCIÓN PLATAFORMAS ============ */}
                    {activeSection === 'plataformas' && (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs text-left">
                                <InfoCircleOutlined />
                                <span>Pulsa sobre una fila para ver más información</span>
                            </div>

                            <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                <Table
                                    columns={plataformaColumns}
                                    dataSource={plataformas}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} plataformas` }}
                                    onRow={(record) => ({
                                        onClick: () => handleVerPlataforma(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                    size="middle"
                                />
                            </div>
                        </>
                    )}

                    {/* ============ SECCIÓN IDIOMAS ============ */}
                    {activeSection === 'idiomas' && (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs text-left">
                                <InfoCircleOutlined />
                                <span>Pulsa sobre una fila para ver más información</span>
                            </div>

                            <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                <Table
                                    columns={idiomaColumns}
                                    dataSource={idiomas}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} idiomas` }}
                                    onRow={(record) => ({
                                        onClick: () => handleVerIdioma(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                    size="middle"
                                />
                            </div>
                        </>
                    )}

                    {/* ============ SECCIÓN CRÍTICAS ============ */}
                    {activeSection === 'criticas' && (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs text-left">
                                <InfoCircleOutlined />
                                <span>Pulsa sobre una fila para ver el comentario completo</span>
                            </div>

                            <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                <Table
                                    columns={criticaColumns}
                                    dataSource={criticas}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} críticas` }}
                                    onRow={(record) => ({
                                        onClick: () => handleVerCritica(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                    size="middle"
                                />
                            </div>
                        </>
                    )}

                    {/* ============ SECCIÓN USUARIOS ============ */}
                    {activeSection === 'usuarios' && (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs text-left">
                                <InfoCircleOutlined />
                                <span>Pulsa sobre una fila para ver más información</span>
                            </div>

                            <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                <Table
                                    columns={usuarioColumns}
                                    dataSource={usuarios}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} usuarios` }}
                                    onRow={(record) => ({
                                        onClick: () => handleVerUsuario(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                    size="middle"
                                />
                            </div>
                        </>
                    )}

                    {/* ============ SECCIÓN FUNCIONES Y SALAS ============ */}
                    {activeSection === 'funciones' && (
                        <>
                            <div className="flex gap-4 mb-6">
                                <Button
                                    onClick={() => setViewFuncionesSubSection('funciones')}
                                    icon={<ScheduleOutlined />}
                                    size="large"
                                    className="transition-colors duration-200 hover:!bg-white/10"
                                    style={viewFuncionesSubSection === 'funciones'
                                        ? { backgroundColor: 'transparent', borderColor: '#E50914', color: '#E50914' }
                                        : { backgroundColor: 'transparent', borderColor: '#444', color: '#888' }}
                                >
                                    Gestionar Funciones
                                </Button>
                                <Button
                                    onClick={() => setViewFuncionesSubSection('salas')}
                                    icon={<SettingOutlined />}
                                    size="large"
                                    className="transition-colors duration-200 hover:!bg-white/10"
                                    style={viewFuncionesSubSection === 'salas'
                                        ? { backgroundColor: 'transparent', borderColor: '#E50914', color: '#E50914' }
                                        : { backgroundColor: 'transparent', borderColor: '#444', color: '#888' }}
                                >
                                    Gestionar Salas
                                </Button>
                            </div>

                            {viewFuncionesSubSection === 'funciones' ? (
                                <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                    <Table
                                        columns={funcionColumns}
                                        dataSource={funciones}
                                        rowKey="id"
                                        loading={loading}
                                        pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} funciones` }}
                                        size="middle"
                                    />
                                </div>
                            ) : (
                                <div className="bg-[#151515] rounded-lg p-4 border border-[#222]">
                                    <Table
                                        columns={salaColumns}
                                        dataSource={salas}
                                        rowKey="id"
                                        loading={loading}
                                        pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} salas` }}
                                        size="small"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Placeholder para otras secciones */}
                    {activeSection !== 'peliculas' && activeSection !== 'directores' && activeSection !== 'actores' && activeSection !== 'plataformas' && activeSection !== 'idiomas' && activeSection !== 'criticas' && activeSection !== 'usuarios' && activeSection !== 'funciones' && (
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
                    footer={
                        [
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
                                        <div className="flex gap-3 flex-wrap">
                                            {selectedPelicula.plataformas?.length > 0 ? (
                                                selectedPelicula.plataformas.map((plat, i) => (
                                                    plat.url ? (
                                                        <img
                                                            key={i}
                                                            src={plat.url}
                                                            alt={plat.nombre}
                                                            title={plat.nombre}
                                                            style={{
                                                                maxWidth: 90,
                                                                maxHeight: 45,
                                                                objectFit: 'contain',
                                                                borderRadius: 4
                                                            }}
                                                        />
                                                    ) : (
                                                        <Tag
                                                            key={i}
                                                            style={{
                                                                backgroundColor: '#1a1a1a',
                                                                borderColor: '#333',
                                                                color: '#fff',
                                                                fontSize: '13px'
                                                            }}
                                                        >
                                                            {plat.nombre}
                                                        </Tag>
                                                    )
                                                ))
                                            ) : (
                                                <span className="text-gray-500">Sin plataformas</span>
                                            )}
                                        </div>
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
                </Modal >

                {/* Modal de Formulario */}
                < Modal
                    title={editingPelicula ? 'Editar Película' : 'Nueva Película'}
                    open={modalVisible}
                    onCancel={() => { setModalVisible(false); setTmdbResults([]); setTmdbSearchQuery(''); }}
                    footer={null}
                    width={950}
                    centered
                >
                    {/* Búsqueda TMDB - sin botón, búsqueda en tiempo real */}
                    < div className="mb-4" >
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
                    </div >

                    {/* Resultados TMDB alineados a la izquierda */}
                    {
                        tmdbResults.length > 0 && (
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
                        )
                    }

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
                </Modal >

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

                {/* ========== MODALES ACTORES ========== */}

                {/* Modal Detalle Actor */}
                <Modal
                    title={null}
                    open={actorDetailVisible}
                    onCancel={() => setActorDetailVisible(false)}
                    footer={[
                        <Button
                            key="edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEditarActor(selectedActor)}
                            size="large"
                            style={{ borderColor: '#E50914', color: '#E50914' }}
                        >
                            Editar Actor
                        </Button>,
                        <Button key="close" size="large" onClick={() => setActorDetailVisible(false)}>
                            Cerrar
                        </Button>
                    ]}
                    width={600}
                    centered
                >
                    {selectedActor && (
                        <div className="flex gap-6 py-4">
                            {selectedActor.fotoUrl && (
                                <div className="shrink-0">
                                    <Image
                                        src={selectedActor.fotoUrl}
                                        alt={selectedActor.nombreCompleto}
                                        width={150}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {selectedActor.nombreCompleto}
                                </h2>
                                <Divider style={{ borderColor: '#333', margin: '16px 0' }} />
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Nombre</span>
                                        <p className="text-white">{selectedActor.nombre}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Apellido</span>
                                        <p className="text-white">{selectedActor.apellido || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Películas</span>
                                        <p className="text-white">{selectedActor.numeroPeliculas} películas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal Formulario Actor */}
                <Modal
                    title={editingActor ? 'Editar Actor' : 'Nuevo Actor'}
                    open={actorModalVisible}
                    onCancel={() => { setActorModalVisible(false); setTmdbActorResults([]); setTmdbActorQuery(''); }}
                    footer={null}
                    width={600}
                    centered
                >
                    {/* Búsqueda TMDB Actores */}
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-2 block">Buscar en TMDB para auto-rellenar</label>
                        <Input
                            placeholder="Escribe el nombre del actor..."
                            value={tmdbActorQuery}
                            onChange={(e) => setTmdbActorQuery(e.target.value)}
                            prefix={<SearchOutlined className="text-gray-500" />}
                            size="large"
                            allowClear
                        />
                    </div>

                    {/* Resultados TMDB */}
                    {tmdbActorResults.length > 0 && (
                        <div
                            className="mb-6 max-h-48 overflow-y-auto rounded-lg border border-gray-700"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            <List
                                dataSource={tmdbActorResults}
                                renderItem={(person) => (
                                    <List.Item
                                        className="cursor-pointer hover:bg-gray-800 px-4 py-3"
                                        onClick={() => handleSelectTmdbActor(person)}
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
                                                <div className="text-gray-500 text-sm">Actor</div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    <Form
                        form={actorForm}
                        layout="vertical"
                        onFinish={handleGuardarActor}
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
                            <Button onClick={() => { setActorModalVisible(false); setTmdbActorResults([]); setTmdbActorQuery(''); }} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                {editingActor ? 'Actualizar' : 'Crear Actor'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* ========== MODALES PLATAFORMAS ========== */}

                {/* Modal Detalle Plataforma */}
                <Modal
                    title={null}
                    open={plataformaDetailVisible}
                    onCancel={() => setPlataformaDetailVisible(false)}
                    footer={[
                        <Button
                            key="edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEditarPlataforma(selectedPlataforma)}
                            size="large"
                            style={{ borderColor: '#E50914', color: '#E50914' }}
                        >
                            Editar Plataforma
                        </Button>,
                        <Button key="close" size="large" onClick={() => setPlataformaDetailVisible(false)}>
                            Cerrar
                        </Button>
                    ]}
                    width={500}
                    centered
                >
                    {selectedPlataforma && (
                        <div className="flex flex-col items-center py-4">
                            {selectedPlataforma.url && (
                                <div className="mb-6">
                                    <img
                                        src={selectedPlataforma.url}
                                        alt={selectedPlataforma.nombre}
                                        style={{ maxWidth: 200, maxHeight: 100, objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {selectedPlataforma.nombre}
                            </h2>
                            <Divider style={{ borderColor: '#333', margin: '16px 0' }} />
                            <div className="space-y-3 w-full">
                                <div>
                                    <span className="text-gray-500 text-xs uppercase">Películas</span>
                                    <p className="text-white">{selectedPlataforma.numeroPeliculas} películas</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal Formulario Plataforma */}
                <Modal
                    title={editingPlataforma ? 'Editar Plataforma' : 'Nueva Plataforma'}
                    open={plataformaModalVisible}
                    onCancel={() => setPlataformaModalVisible(false)}
                    footer={null}
                    width={500}
                    centered
                >
                    <Form
                        form={plataformaForm}
                        layout="vertical"
                        onFinish={handleGuardarPlataforma}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                        >
                            <Input placeholder="Nombre de la plataforma" />
                        </Form.Item>

                        <Form.Item
                            name="url"
                            label="URL del Logo"
                            rules={[{ required: true, message: 'La URL del logo es obligatoria' }]}
                        >
                            <Input placeholder="URL de la imagen del logo" />
                        </Form.Item>

                        {/* Preview de logo */}
                        <Form.Item noStyle shouldUpdate={(prev, curr) => prev.url !== curr.url}>
                            {({ getFieldValue }) => {
                                const url = getFieldValue('url');
                                return url ? (
                                    <div className="mb-4 flex justify-center">
                                        <img
                                            src={url}
                                            alt="Preview"
                                            style={{ maxWidth: 150, maxHeight: 80, objectFit: 'contain' }}
                                        />
                                    </div>
                                ) : null;
                            }}
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                            <Button onClick={() => setPlataformaModalVisible(false)} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                {editingPlataforma ? 'Actualizar' : 'Crear Plataforma'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* ========== MODALES IDIOMAS ========== */}

                {/* Modal Detalle Idioma */}
                <Modal
                    title={null}
                    open={idiomaDetailVisible}
                    onCancel={() => setIdiomaDetailVisible(false)}
                    footer={[
                        <Button
                            key="edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEditarIdioma(selectedIdioma)}
                            size="large"
                            style={{ borderColor: '#E50914', color: '#E50914' }}
                        >
                            Editar Idioma
                        </Button>,
                        <Button key="close" size="large" onClick={() => setIdiomaDetailVisible(false)}>
                            Cerrar
                        </Button>
                    ]}
                    width={500}
                    centered
                >
                    {selectedIdioma && (
                        <div className="flex flex-col items-center py-4">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {selectedIdioma.nombre}
                            </h2>
                            <Divider style={{ borderColor: '#333', margin: '16px 0' }} />
                            <div className="space-y-3 w-full">
                                <div>
                                    <span className="text-gray-500 text-xs uppercase">Películas</span>
                                    <p className="text-white">{selectedIdioma.numeroPeliculas} películas</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal Formulario Idioma */}
                <Modal
                    title={editingIdioma ? 'Editar Idioma' : 'Nuevo Idioma'}
                    open={idiomaModalVisible}
                    onCancel={() => setIdiomaModalVisible(false)}
                    footer={null}
                    width={400}
                    centered
                >
                    <Form
                        form={idiomaForm}
                        layout="vertical"
                        onFinish={handleGuardarIdioma}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                        >
                            <Input placeholder="Nombre del idioma" />
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                            <Button onClick={() => setIdiomaModalVisible(false)} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                {editingIdioma ? 'Actualizar' : 'Crear Idioma'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* ========== MODALES CRÍTICAS ========== */}

                {/* Modal Detalle Crítica */}
                <Modal
                    title={null}
                    open={criticaDetailVisible}
                    onCancel={() => setCriticaDetailVisible(false)}
                    footer={[
                        <Button
                            key="edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEditarCritica(selectedCritica)}
                            size="large"
                            style={{ borderColor: '#E50914', color: '#E50914' }}
                        >
                            Editar Crítica
                        </Button>,
                        <Button key="close" size="large" onClick={() => setCriticaDetailVisible(false)}>
                            Cerrar
                        </Button>
                    ]}
                    width={600}
                    centered
                >
                    {selectedCritica && (
                        <div className="py-4">
                            <h2 className="text-xl font-bold text-white mb-1">
                                {selectedCritica.peliculaTitulo}
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Por {selectedCritica.autor} • {selectedCritica.fecha}
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-yellow-400 text-2xl font-bold">
                                    ⭐ {selectedCritica.nota?.toFixed(1)}
                                </span>
                                <span className="text-gray-500">/ 10</span>
                            </div>
                            <Divider style={{ borderColor: '#333', margin: '16px 0' }} />
                            <div>
                                <span className="text-gray-500 text-xs uppercase">Comentario</span>
                                <p className="text-white mt-2 whitespace-pre-wrap">
                                    {selectedCritica.comentario || 'Sin comentario'}
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal Formulario Crítica */}
                <Modal
                    title={editingCritica ? 'Editar Crítica' : 'Nueva Crítica'}
                    open={criticaModalVisible}
                    onCancel={() => setCriticaModalVisible(false)}
                    footer={null}
                    width={600}
                    centered
                >
                    <Form
                        form={criticaForm}
                        layout="vertical"
                        onFinish={handleGuardarCritica}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="peliculaId"
                            label="Película"
                            rules={[{ required: true, message: 'Selecciona una película' }]}
                        >
                            <Select
                                placeholder="Selecciona una película"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {peliculas.map(p => (
                                    <Select.Option key={p.id} value={p.id}>{p.titulo}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="autor"
                                label="Autor"
                                rules={[{ required: true, message: 'El autor es obligatorio' }]}
                            >
                                <Input placeholder="Nombre del autor" />
                            </Form.Item>

                            <Form.Item
                                name="nota"
                                label="Puntuación"
                                rules={[{ required: true, message: 'La puntuación es obligatoria' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    placeholder="0-10"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="comentario"
                            label="Comentario"
                            rules={[{ required: true, message: 'El comentario es obligatorio' }]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Escribe tu crítica..."
                            />
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                            <Button onClick={() => setCriticaModalVisible(false)} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                {editingCritica ? 'Actualizar' : 'Crear Crítica'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* ========== MODALES USUARIOS ========== */}

                {/* Modal Detalle Usuario */}
                <Modal
                    title={null}
                    open={usuarioDetailVisible}
                    onCancel={() => setUsuarioDetailVisible(false)}
                    footer={[
                        <Button
                            key="edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEditarUsuario(selectedUsuario)}
                            size="large"
                            style={{ borderColor: '#E50914', color: '#E50914' }}
                        >
                            Editar Usuario
                        </Button>,
                        <Button key="close" size="large" onClick={() => setUsuarioDetailVisible(false)}>
                            Cerrar
                        </Button>
                    ]}
                    width={500}
                    centered
                >
                    {selectedUsuario && (
                        <div className="py-4 text-center">
                            <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4">
                                <UserOutlined style={{ fontSize: '40px', color: '#fff' }} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">
                                {selectedUsuario.username}
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">
                                {selectedUsuario.email}
                            </p>

                            <div className="flex justify-center gap-2 mb-6">
                                {selectedUsuario.admin ? (
                                    <Tag color="red">ADMINISTRADOR</Tag>
                                ) : (
                                    <Tag>USUARIO ESTÁNDAR</Tag>
                                )}
                            </div>

                            <Divider style={{ borderColor: '#333' }} />

                            <div className="text-left bg-gray-800 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase mb-1">Contraseña</p>
                                <p className="font-mono text-white text-lg tracking-widest">
                                    {selectedUsuario.password}
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Modal Formulario Usuario */}
                <Modal
                    title={editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                    open={usuarioModalVisible}
                    onCancel={() => setUsuarioModalVisible(false)}
                    footer={null}
                    width={500}
                    centered
                >
                    <Form
                        form={usuarioForm}
                        layout="vertical"
                        onFinish={handleGuardarUsuario}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="username"
                            label="Nombre de usuario"
                            rules={[{ required: true, message: 'El usuario es obligatorio' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Usuario" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'El email es obligatorio' },
                                { type: 'email', message: 'Email inválido' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Contraseña"
                            rules={[{ required: true, message: 'La contraseña es obligatoria' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
                        </Form.Item>

                        <Form.Item
                            name="admin"
                            valuePropName="checked"
                        >
                            <Checkbox className="text-white">Es Administrador</Checkbox>
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                            <Button onClick={() => setUsuarioModalVisible(false)} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}
                            >
                                {editingUsuario ? 'Actualizar' : 'Crear Usuario'}
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* ========== MODALES FUNCIONES Y SALAS ========== */}

                {/* Modal Sala */}
                <Modal
                    title={editingSala ? 'Editar Sala' : 'Nueva Sala'}
                    open={salaModalVisible}
                    onCancel={() => setSalaModalVisible(false)}
                    footer={null}
                    centered
                >
                    <Form
                        form={salaForm}
                        layout="vertical"
                        onFinish={handleGuardarSala}
                    >
                        <Form.Item name="numeroSala" label="Número de Sala" rules={[{ required: true }]}>
                            <InputNumber min={1} className="w-full" placeholder="Ej: 1" />
                        </Form.Item>
                        <Form.Item name="capacidad" label="Capacidad" rules={[{ required: true }]}>
                            <InputNumber min={1} className="w-full" placeholder="Ej: 100" />
                        </Form.Item>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={() => setSalaModalVisible(false)}>Cancelar</Button>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}>
                                Guardar
                            </Button>
                        </div>
                    </Form>
                </Modal>

                {/* Modal Función */}
                <Modal
                    title={editingFuncion ? 'Editar Función' : 'Nueva Función'}
                    open={funcionModalVisible}
                    onCancel={() => setFuncionModalVisible(false)}
                    footer={null}
                    width={600}
                    centered
                >
                    <Form
                        form={funcionForm}
                        layout="vertical"
                        onFinish={handleGuardarFuncion}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="peliculaId"
                                label="Película"
                                className="col-span-2"
                                rules={[{ required: true, message: 'Selecciona una película' }]}
                            >
                                <Select
                                    placeholder="Buscar película..."
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={peliculas.map(p => ({ label: p.titulo, value: p.id }))}
                                />
                            </Form.Item>

                            <Form.Item name="salaId" label="Sala" rules={[{ required: true }]}>
                                <Select placeholder="Selecciona sala">
                                    {salas.map(s => (
                                        <Select.Option key={s.id} value={s.id}>Sala {s.numeroSala} ({s.capacidad} pax)</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="formato" label="Formato" rules={[{ required: true }]}>
                                <Select placeholder="Formato">
                                    <Select.Option value="2D">2D Estándar</Select.Option>
                                    <Select.Option value="3D">3D</Select.Option>
                                    <Select.Option value="IMAX">IMAX</Select.Option>
                                    <Select.Option value="4DX">4DX</Select.Option>
                                    <Select.Option value="VOSE">VOSE</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
                                <DatePicker className="w-full" format="DD/MM/YYYY" />
                            </Form.Item>

                            <Form.Item name="hora" label="Hora" rules={[{ required: true }]}>
                                <TimePicker className="w-full" format="HH:mm" />
                            </Form.Item>

                            <Form.Item name="precio" label="Precio (€)" rules={[{ required: true }]}>
                                <InputNumber min={0} step={0.5} className="w-full" />
                            </Form.Item>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={() => setFuncionModalVisible(false)}>Cancelar</Button>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}>
                                Guardar
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

            </div >
        </ConfigProvider >
    );
};

export default AdminPeliculasPage;
