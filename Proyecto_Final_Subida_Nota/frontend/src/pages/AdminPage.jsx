import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, InputNumber, Space, notification, Spin, ConfigProvider, theme, Tag, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined, ExclamationCircleOutlined, VideoCameraOutlined, UserOutlined, TeamOutlined, ScheduleOutlined, ShoppingCartOutlined, DashboardOutlined, DollarOutlined, RiseOutlined, SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { searchMovies, getMovieDetails } from '../api/tmdb';
import dayjs from 'dayjs';
import logo from '../assets/logo.png';

const { TextArea } = Input;

const AdminPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [notifApi, contextHolder] = notification.useNotification();
    const [modal, modalContextHolder] = Modal.useModal();
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    // Data states
    const [peliculas, setPeliculas] = useState([]);
    const [salas, setSalas] = useState([]);
    const [funciones, setFunciones] = useState([]);
    const [ventas, setVentas] = useState([]);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    // TMDB autocomplete states
    const [tmdbQuery, setTmdbQuery] = useState('');
    const [tmdbResults, setTmdbResults] = useState([]);
    const [tmdbLoading, setTmdbLoading] = useState(false);
    const [selectedTmdb, setSelectedTmdb] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [directores, setDirectores] = useState([]);
    const searchTimeout = useRef(null);
    const dropdownRef = useRef(null);

    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#E50914', colorBgContainer: '#1a1a1a', colorBgElevated: '#1f1f1f', borderRadius: 8 },
    };

    const menuSections = [
        { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
        { key: 'peliculas', label: 'Películas', icon: <VideoCameraOutlined /> },
        { key: 'salas', label: 'Salas', icon: <UserOutlined /> },
        { key: 'funciones', label: 'Sesiones', icon: <ScheduleOutlined /> },
        { key: 'ventas', label: 'Ventas', icon: <ShoppingCartOutlined /> },
    ];

    useEffect(() => { loadData(); }, [activeSection]);

    // Cargar directores para el selector
    useEffect(() => {
        api.get('/api/v1/directores').then(res => setDirectores(res.data)).catch(() => {});
    }, []);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Búsqueda TMDB con debounce
    const handleTmdbSearch = (value) => {
        setTmdbQuery(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (!value || value.length < 2) { setTmdbResults([]); setShowDropdown(false); return; }
        setTmdbLoading(true);
        setShowDropdown(true);
        searchTimeout.current = setTimeout(async () => {
            const results = await searchMovies(value);
            setTmdbResults(results.slice(0, 8));
            setTmdbLoading(false);
        }, 400);
    };

    // Al seleccionar una película de TMDB
    const handleSelectTmdb = async (movie) => {
        setShowDropdown(false);
        setTmdbLoading(true);
        const details = await getMovieDetails(movie.tmdbId);
        setTmdbLoading(false);
        if (!details) { notifApi.error({ message: 'Error al obtener detalles de TMDB' }); return; }
        setSelectedTmdb(details);
        setTmdbQuery(details.titulo);

        // Buscar/crear director
        let directorId = null;
        if (details.director && details.director !== 'Desconocido') {
            const match = directores.find(d => d.nombre.toLowerCase() === details.director.toLowerCase());
            if (match) {
                directorId = match.id;
            } else {
                try {
                    const res = await api.post('/api/v1/directores', { nombre: details.director });
                    directorId = res.data.id;
                    setDirectores(prev => [...prev, res.data]);
                } catch { /* ignore */ }
            }
        }

        form.setFieldsValue({
            titulo: details.titulo,
            sinopsis: details.sinopsis || '',
            genero: details.generos?.[0] || details.genero || '',
            imagenUrl: details.posterUrl || '',
            duracion: details.duracion || 120,
            edadMinima: 0,
            directorId: directorId,
        });
    };

    const clearTmdbSelection = () => {
        setSelectedTmdb(null);
        setTmdbQuery('');
        setTmdbResults([]);
        form.resetFields();
    };

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeSection === 'dashboard') {
                const [pRes, sRes, fRes, vRes] = await Promise.all([
                    api.get('/api/v1/peliculas'), api.get('/api/v1/salas'),
                    api.get('/api/v1/funciones'), api.get('/api/v1/ventas'),
                ]);
                setPeliculas(pRes.data); setSalas(sRes.data);
                setFunciones(fRes.data); setVentas(vRes.data);
            } else if (activeSection === 'peliculas') {
                const res = await api.get('/api/v1/peliculas');
                setPeliculas(res.data);
            } else if (activeSection === 'salas') {
                const res = await api.get('/api/v1/salas');
                setSalas(res.data);
            } else if (activeSection === 'funciones') {
                const [fRes, pRes, sRes] = await Promise.all([
                    api.get('/api/v1/funciones'), api.get('/api/v1/peliculas'), api.get('/api/v1/salas'),
                ]);
                setFunciones(fRes.data); setPeliculas(pRes.data); setSalas(sRes.data);
            } else if (activeSection === 'ventas') {
                const res = await api.get('/api/v1/ventas');
                setVentas(res.data);
            }
        } catch (err) {
            notifApi.error({ message: 'Error', description: 'No se pudieron cargar los datos' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    // ===== CRUD Helpers =====
    const openNew = () => { setEditing(null); form.resetFields(); setSelectedTmdb(null); setTmdbQuery(''); setTmdbResults([]); setModalVisible(true); };
    const openEdit = (record) => {
        setEditing(record);
        if (activeSection === 'peliculas') {
            form.setFieldsValue({ titulo: record.titulo, sinopsis: record.sinopsis, genero: record.genero, imagenUrl: record.imagenUrl, duracion: record.duracion, edadMinima: record.edadMinima, directorId: record.directorId });
        } else if (activeSection === 'salas') {
            form.setFieldsValue({ nombre: record.nombre, capacidad: record.capacidad, tipo: record.tipo || 'STANDARD', filas: record.filas || 10, asientosPorFila: record.asientosPorFila || 15 });
        } else if (activeSection === 'funciones') {
            form.setFieldsValue({ peliculaId: record.peliculaId, salaId: record.salaId, precio: record.precio, fechaHora: dayjs(record.fechaHora) });
        }
        setModalVisible(true);
    };

    const handleDelete = (id) => {
        const urls = { peliculas: '/api/v1/peliculas', salas: '/api/v1/salas', funciones: '/api/v1/funciones', ventas: '/api/v1/ventas' };
        modal.confirm({
            title: '¿Eliminar este registro?', icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer.', okText: 'Sí, eliminar', okType: 'danger', cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    await api.delete(`${urls[activeSection]}/${id}`);
                    notifApi.success({ message: 'Eliminado correctamente' });
                    loadData();
                } catch (err) {
                    notifApi.error({ message: 'Error al eliminar', description: err.response?.data?.message || '' });
                }
            }
        });
    };

    const handleSave = async (values) => {
        const urls = { peliculas: '/api/v1/peliculas', salas: '/api/v1/salas', funciones: '/api/v1/funciones' };
        try {
            let data = { ...values };
            if (activeSection === 'funciones' && values.fechaHora) {
                data.fechaHora = values.fechaHora.format('YYYY-MM-DDTHH:mm:ss');
            }
            if (editing) {
                await api.put(`${urls[activeSection]}/${editing.id}`, data);
                notifApi.success({ message: 'Actualizado correctamente' });
            } else {
                await api.post(urls[activeSection], data);
                notifApi.success({ message: 'Creado correctamente' });
            }
            setModalVisible(false);
            loadData();
        } catch (err) {
            notifApi.error({ message: 'Error', description: err.response?.data?.message || 'No se pudo guardar' });
        }
    };

    // ===== Columns =====
    const peliculaColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Título', dataIndex: 'titulo', key: 'titulo', render: t => <span className="font-semibold text-white">{t}</span> },
        { title: 'Género', dataIndex: 'genero', key: 'genero', render: g => <Tag color="blue">{g}</Tag> },
        { title: 'Duración', dataIndex: 'duracion', key: 'duracion', width: 100, render: d => `${d} min` },
        { title: 'Edad', dataIndex: 'edadMinima', key: 'edadMinima', width: 80, render: e => `+${e}` },
        { title: 'Acciones', key: 'acciones', width: 120, render: (_, r) => (
            <Space>
                <Button size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); openEdit(r); }} style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }} />
                <Button size="small" icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }} />
            </Space>
        )},
    ];

    const salaColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', render: t => <span className="font-semibold text-white">{t}</span> },
        { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad', render: c => `${c} asientos` },
        { title: 'Acciones', key: 'acciones', width: 120, render: (_, r) => (
            <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }} />
                <Button size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }} />
            </Space>
        )},
    ];

    const funcionColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Película', dataIndex: 'peliculaTitulo', key: 'peliculaTitulo', render: t => <span className="font-semibold text-white">{t}</span> },
        { title: 'Sala', dataIndex: 'salaNombre', key: 'salaNombre' },
        { title: 'Fecha/Hora', dataIndex: 'fechaHora', key: 'fechaHora', render: f => dayjs(f).format('DD/MM/YYYY HH:mm') },
        { title: 'Precio', dataIndex: 'precio', key: 'precio', render: p => <span className="text-green-400 font-bold">{p?.toFixed(2)}€</span> },
        { title: 'Disponibles', dataIndex: 'asientosDisponibles', key: 'asientos', render: a => <Tag color={a > 0 ? 'green' : 'red'}>{a}</Tag> },
        { title: 'Acciones', key: 'acciones', width: 120, render: (_, r) => (
            <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ backgroundColor: 'transparent', color: '#888', borderColor: '#444' }} />
                <Button size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} style={{ backgroundColor: 'transparent', color: '#E50914', borderColor: '#E50914' }} />
            </Space>
        )},
    ];

    const ventaColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Usuario', dataIndex: 'creadoPor', key: 'creadoPor', render: t => <span className="text-white">{t}</span> },
        { title: 'Total', dataIndex: 'importeTotal', key: 'importeTotal', render: t => <span className="text-green-400 font-bold">{t?.toFixed(2)}€</span> },
        { title: 'Estado', dataIndex: 'estado', key: 'estado', render: e => <Tag color={e === 'COMPLETADA' ? 'green' : 'red'}>{e}</Tag> },
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', render: f => f ? dayjs(f).format('DD/MM/YYYY HH:mm') : 'N/A' },
        { title: 'Pago', dataIndex: 'metodoPago', key: 'metodoPago' },
        { title: 'Entradas', key: 'entradas', render: (_, r) => <span>{r.entradas?.length || 0}</span> },
    ];

    const getColumns = () => {
        if (activeSection === 'peliculas') return peliculaColumns;
        if (activeSection === 'salas') return salaColumns;
        if (activeSection === 'funciones') return funcionColumns;
        if (activeSection === 'ventas') return ventaColumns;
        return [];
    };

    const getData = () => {
        if (activeSection === 'peliculas') return peliculas;
        if (activeSection === 'salas') return salas;
        if (activeSection === 'funciones') return funciones;
        if (activeSection === 'ventas') return ventas;
        return [];
    };

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
                {contextHolder}{modalContextHolder}

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
                            <button className="nav-btn" onClick={() => navigate('/mis-entradas')}>Mis Entradas</button>
                            <span className="nav-separator text-gray-700 text-xl font-thin mx-2">|</span>
                            <button className="nav-btn-highlight">Panel Admin</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-5 shrink-0">
                        <div className="text-right">
                            <span className="user-greeting text-gray-500 text-xs block">Admin</span>
                            <span className="user-name text-white font-medium text-sm sm:text-base whitespace-nowrap">{user?.email}</span>
                        </div>
                        <Button icon={<LogoutOutlined />} onClick={handleLogout} className="logout-btn"
                            style={{ backgroundColor: '#2a2a2a', borderColor: '#3a3a3a', color: '#999' }}>Cerrar Sesión</Button>
                    </div>
                </header>

                {/* BODY */}
                <div className="admin-body flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="admin-sidebar w-60 shrink-0 border-r border-zinc-800 p-4 flex flex-col gap-2" style={{ backgroundColor: '#0f0f0f' }}>
                        <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3 px-3">Gestión</h3>
                        {menuSections.map(s => (
                            <button key={s.key} onClick={() => setActiveSection(s.key)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left w-full transition-all duration-200 ${
                                    activeSection === s.key ? 'bg-red-600/20 text-white border border-red-600/30' : 'text-gray-400 hover:text-white hover:bg-zinc-800 border border-transparent'
                                }`}>
                                {s.icon}
                                <span className="font-medium">{s.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Content */}
                    <main className="admin-main flex-1 overflow-y-auto custom-scrollbar p-8">
                        {activeSection === 'dashboard' ? (
                            <DashboardView peliculas={peliculas} salas={salas} funciones={funciones} ventas={ventas} loading={loading} />
                        ) : (<>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-white capitalize">{activeSection}</h2>
                                {activeSection !== 'ventas' && (
                                    <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openNew}
                                        style={{ backgroundColor: '#E50914', border: 'none', fontWeight: 'bold' }}>
                                        Nuevo
                                    </Button>
                                )}
                            </div>
                            {loading ? (
                                <div className="flex items-center justify-center py-20"><Spin size="large" /></div>
                            ) : (
                                <Table columns={getColumns()} dataSource={getData()} rowKey="id" pagination={{ pageSize: 10 }}
                                    className="custom-table" locale={{ emptyText: 'No hay datos' }}
                                    style={{ backgroundColor: 'transparent' }} />
                            )}
                        </>)}
                    </main>
                </div>

                {/* MODAL CREATE/EDIT */}
                <Modal open={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={600} centered destroyOnHidden
                    title={<span className="text-white text-xl font-bold">{editing ? 'Editar' : 'Crear'} {activeSection.slice(0, -1)}</span>}
                    styles={{ content: { backgroundColor: '#1a1a1a', border: '1px solid #333' }, header: { backgroundColor: '#1a1a1a' } }}>
                    <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false} size="large">
                        {activeSection === 'peliculas' && (<>
                            {/* TMDB Autocomplete Search */}
                            {!editing && (
                                <div style={{ marginBottom: 20, position: 'relative' }} ref={dropdownRef}>
                                    <label className="text-gray-300 block mb-2" style={{ fontSize: 14 }}>🔍 Buscar en TMDB</label>
                                    <div style={{ position: 'relative' }}>
                                        <Input
                                            prefix={<SearchOutlined style={{ color: '#666' }} />}
                                            suffix={tmdbLoading ? <Spin size="small" /> : (tmdbQuery && <CloseCircleOutlined style={{ color: '#666', cursor: 'pointer' }} onClick={clearTmdbSelection} />)}
                                            placeholder="Escribe el título de la película..."
                                            value={tmdbQuery}
                                            onChange={(e) => handleTmdbSearch(e.target.value)}
                                            style={{ backgroundColor: '#111', borderColor: selectedTmdb ? '#E50914' : '#333', height: 48, fontSize: 16 }}
                                        />
                                        {showDropdown && tmdbResults.length > 0 && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
                                                backgroundColor: '#1a1a1a', border: '1px solid #E50914', borderRadius: 12,
                                                maxHeight: 380, overflowY: 'auto', marginTop: 4,
                                                boxShadow: '0 12px 40px rgba(229, 9, 20, 0.25)'
                                            }}>
                                                {tmdbResults.map((m) => (
                                                    <div key={m.tmdbId} onClick={() => handleSelectTmdb(m)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                                                            cursor: 'pointer', borderBottom: '1px solid #222', transition: 'background 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#2a1a1a'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                        {m.posterUrl ? (
                                                            <img src={m.posterUrl} alt="" style={{ width: 40, height: 60, borderRadius: 6, objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{ width: 40, height: 60, borderRadius: 6, backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <VideoCameraOutlined style={{ color: '#666' }} />
                                                            </div>
                                                        )}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.titulo}</div>
                                                            <div style={{ color: '#888', fontSize: 12 }}>{m.fechaEstreno?.slice(0, 4) || 'N/A'} · ⭐ {m.valoracion}</div>
                                                        </div>
                                                        <Tag color="red" style={{ margin: 0, fontSize: 10 }}>{m.genero}</Tag>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {selectedTmdb && (
                                        <div style={{ marginTop: 12, display: 'flex', gap: 14, padding: 14, backgroundColor: '#111', borderRadius: 12, border: '1px solid #E50914' }}>
                                            {selectedTmdb.posterUrl && (
                                                <img src={selectedTmdb.posterUrl} alt="" style={{ width: 80, height: 120, borderRadius: 8, objectFit: 'cover' }} />
                                            )}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{selectedTmdb.titulo}</div>
                                                <div style={{ color: '#E50914', fontSize: 12, marginBottom: 4 }}>🎬 {selectedTmdb.director}</div>
                                                <div style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>{selectedTmdb.duracion} min · ⭐ {selectedTmdb.valoracion}</div>
                                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                    {selectedTmdb.generos?.slice(0, 3).map((g, i) => <Tag key={i} color="volcano" style={{ margin: 0, fontSize: 10 }}>{g}</Tag>)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <Form.Item name="titulo" label={<span className="text-gray-300">Título</span>} rules={[{ required: true }]}>
                                <Input placeholder="Título de la película" />
                            </Form.Item>
                            <Form.Item name="sinopsis" label={<span className="text-gray-300">Sinopsis</span>}>
                                <TextArea rows={3} placeholder="Sinopsis..." />
                            </Form.Item>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="genero" label={<span className="text-gray-300">Género</span>}>
                                    <Input placeholder="Ciencia Ficción" />
                                </Form.Item>
                                <Form.Item name="duracion" label={<span className="text-gray-300">Duración (min)</span>} rules={[{ required: true }]}>
                                    <InputNumber min={1} className="w-full" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="edadMinima" label={<span className="text-gray-300">Edad mínima</span>}>
                                    <InputNumber min={0} className="w-full" />
                                </Form.Item>
                                <Form.Item name="directorId" label={<span className="text-gray-300">Director</span>} rules={[{ required: true }]}>
                                    <Select placeholder="Selecciona director" showSearch optionFilterProp="label"
                                        options={directores.map(d => ({ value: d.id, label: d.nombre }))}
                                        style={{ width: '100%' }} />
                                </Form.Item>
                            </div>
                            <Form.Item name="imagenUrl" label={<span className="text-gray-300">URL Imagen</span>}>
                                <Input placeholder="https://..." />
                            </Form.Item>
                        </>)}

                        {activeSection === 'salas' && (<>
                            <Form.Item name="nombre" label={<span className="text-gray-300">Nombre</span>} rules={[{ required: true }]}>
                                <Input placeholder="Sala IMAX 1" />
                            </Form.Item>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="capacidad" label={<span className="text-gray-300">Capacidad Total</span>} rules={[{ required: true }]}>
                                    <InputNumber min={1} className="w-full" placeholder="150" />
                                </Form.Item>
                                <Form.Item name="tipo" label={<span className="text-gray-300">Tipo de Sala</span>} rules={[{ required: true }]} initialValue="STANDARD">
                                    <Select options={[{ value: 'STANDARD', label: 'Estándar' }, { value: 'VIP', label: 'Sala VIP' }, { value: 'IMAX', label: 'IMAX' }, { value: 'FOUR_DX', label: '4DX' }]} />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="filas" label={<span className="text-gray-300">Nº de Filas</span>} rules={[{ required: true }]} initialValue={10}>
                                    <InputNumber min={1} className="w-full" placeholder="10" />
                                </Form.Item>
                                <Form.Item name="asientosPorFila" label={<span className="text-gray-300">Asientos por Fila</span>} rules={[{ required: true }]} initialValue={15}>
                                    <InputNumber min={1} className="w-full" placeholder="15" />
                                </Form.Item>
                            </div>
                        </>)}

                        {activeSection === 'funciones' && (<>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="peliculaId" label={<span className="text-gray-300">Película</span>} rules={[{ required: true }]}>
                                    <Select placeholder="Selecciona película" showSearch optionFilterProp="label"
                                        options={peliculas.map(p => ({ value: p.id, label: p.titulo }))}
                                        style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name="salaId" label={<span className="text-gray-300">Sala</span>} rules={[{ required: true }]}>
                                    <Select placeholder="Selecciona sala" showSearch optionFilterProp="label"
                                        options={salas.map(s => ({ value: s.id, label: s.nombre }))}
                                        style={{ width: '100%' }} />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="fechaHora" label={<span className="text-gray-300">Fecha y Hora</span>} rules={[{ required: true }]}>
                                    <DatePicker showTime format="DD/MM/YYYY HH:mm" className="w-full" />
                                </Form.Item>
                                <Form.Item name="precio" label={<span className="text-gray-300">Precio (€)</span>} rules={[{ required: true }]}>
                                    <InputNumber min={0} step={0.5} className="w-full" />
                                </Form.Item>
                            </div>
                        </>)}

                        <Form.Item className="mt-6">
                            <Button type="primary" htmlType="submit" block size="large"
                                style={{ backgroundColor: '#E50914', border: 'none', fontWeight: 'bold' }}>
                                {editing ? 'Actualizar' : 'Crear'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

// ===== DASHBOARD CON GRÁFICAS =====
const COLORS = ['#E50914', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A855F7', '#EC4899'];

const DashboardView = ({ peliculas, salas, funciones, ventas, loading }) => {
    if (loading) return <div className="flex items-center justify-center py-20"><Spin size="large" /></div>;

    const totalIngresos = ventas.filter(v => v.estado === 'COMPLETADA').reduce((s, v) => s + (v.importeTotal || 0), 0);
    const totalEntradas = ventas.filter(v => v.estado === 'COMPLETADA').reduce((s, v) => s + (v.entradas?.length || 0), 0);
    const ventasCanceladas = ventas.filter(v => v.estado === 'CANCELADA').length;
    const ventasCompletadas = ventas.filter(v => v.estado === 'COMPLETADA').length;

    // Datos para gráfico de barras: ingresos por película
    const ingresosPorPeli = {};
    ventas.filter(v => v.estado === 'COMPLETADA').forEach(v => {
        v.entradas?.forEach(e => {
            const titulo = e.peliculaTitulo || 'Sin título';
            ingresosPorPeli[titulo] = (ingresosPorPeli[titulo] || 0) + (v.importeTotal || 0) / (v.entradas?.length || 1);
        });
    });
    const barData = Object.entries(ingresosPorPeli).map(([name, ingresos]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, ingresos: Math.round(ingresos * 100) / 100 }));

    // Datos para gráfico circular: estado de ventas
    const pieData = [
        { name: 'Completadas', value: ventasCompletadas },
        { name: 'Canceladas', value: ventasCanceladas },
    ].filter(d => d.value > 0);
    if (pieData.length === 0) pieData.push({ name: 'Sin datos', value: 1 });

    // Datos para gráfico: películas por género
    const generoCount = {};
    peliculas.forEach(p => { if (p.genero) generoCount[p.genero] = (generoCount[p.genero] || 0) + 1; });
    const genreData = Object.entries(generoCount).map(([name, value]) => ({ name, value }));

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-8">📊 Dashboard</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Ingresos Totales', value: `${totalIngresos.toFixed(2)}€`, icon: <DollarOutlined />, color: 'from-green-900/50 to-green-700/30', border: 'border-green-600/40', text: 'text-green-400' },
                    { label: 'Entradas Vendidas', value: totalEntradas, icon: <ShoppingCartOutlined />, color: 'from-blue-900/50 to-blue-700/30', border: 'border-blue-600/40', text: 'text-blue-400' },
                    { label: 'Películas en Cartelera', value: peliculas.length, icon: <VideoCameraOutlined />, color: 'from-red-900/50 to-red-700/30', border: 'border-red-600/40', text: 'text-red-400' },
                    { label: 'Sesiones Programadas', value: funciones.length, icon: <ScheduleOutlined />, color: 'from-purple-900/50 to-purple-700/30', border: 'border-purple-600/40', text: 'text-purple-400' },
                ].map((kpi, i) => (
                    <div key={i} className={`bg-gradient-to-br ${kpi.color} p-6 rounded-2xl border ${kpi.border}`}>
                        <div className={`${kpi.text} text-2xl mb-2`}>{kpi.icon}</div>
                        <p className="text-gray-400 text-sm">{kpi.label}</p>
                        <p className={`${kpi.text} text-3xl font-black mt-1`}>{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar: Ingresos por película */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-white font-bold text-lg mb-4"><RiseOutlined className="text-green-400 mr-2" />Ingresos por Película</h3>
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={barData}>
                                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#999', fontSize: 11 }} />
                                <YAxis stroke="#666" tick={{ fill: '#999' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
                                <Bar dataKey="ingresos" fill="#E50914" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-500 text-center py-16">Sin datos de ventas</p>}
                </div>

                {/* Pie: Estado de ventas */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                    <h3 className="text-white font-bold text-lg mb-4"><ShoppingCartOutlined className="text-blue-400 mr-2" />Estado de Ventas</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
                            <Legend wrapperStyle={{ color: '#999' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie: Películas por género */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 lg:col-span-2">
                    <h3 className="text-white font-bold text-lg mb-4"><VideoCameraOutlined className="text-red-400 mr-2" />Distribución por Género</h3>
                    {genreData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={genreData} layout="vertical">
                                <XAxis type="number" stroke="#666" tick={{ fill: '#999' }} />
                                <YAxis dataKey="name" type="category" stroke="#666" tick={{ fill: '#999' }} width={120} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
                                <Bar dataKey="value" fill="#A855F7" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-500 text-center py-16">Sin películas en cartelera</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
