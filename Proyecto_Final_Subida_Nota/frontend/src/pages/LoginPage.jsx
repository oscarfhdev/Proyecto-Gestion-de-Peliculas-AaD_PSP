import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { login, register, isAdmin } = useAuth();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, message, description) => {
        api[type]({ message, description, placement: 'topRight', duration: 3 });
    };

    // Login con JWT
    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const msg = await login(values.email, values.password);
            openNotification('success', 'Acceso correcto', msg);
            setTimeout(() => {
                // Leer roles actualizados del localStorage
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData?.roles?.includes('ADMIN')) {
                    navigate('/admin');
                } else {
                    navigate('/cartelera');
                }
            }, 800);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Credenciales incorrectas';
            openNotification('error', 'Error de autenticación', errMsg);
        } finally {
            setLoading(false);
        }
    };

    // Registro con JWT (devuelve token automáticamente)
    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const msg = await register(values.email, values.password, values.nombre);
            openNotification('success', 'Cuenta creada', msg);
            setTimeout(() => navigate('/cartelera'), 800);
        } catch (error) {
            const errMsg = error.response?.data?.message || 'No se pudo crear la cuenta';
            openNotification('error', 'Error al registrar', errMsg);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        form.resetFields();
    };

    return (
        <>
            {contextHolder}
            <div
                className="fixed inset-0 w-screen h-screen flex"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative z-10 w-full h-full flex">
                    {/* Sección izquierda - Logo */}
                    <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col items-center justify-center p-12">
                        <img src={logo} alt="OFHCINEMA Logo" className="w-80 xl:w-96 h-auto object-contain drop-shadow-2xl mb-8" />
                        <h1 className="text-white text-4xl xl:text-5xl font-bold text-center mb-4 drop-shadow-lg">
                            Bienvenido a OFH CINEMA
                        </h1>
                        <p className="text-gray-300 text-xl xl:text-2xl text-center max-w-lg">
                            Tu destino para las mejores películas y experiencias cinematográficas
                        </p>
                    </div>

                    {/* Sección derecha - Formulario */}
                    <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
                        <div className="w-full max-w-md lg:max-w-lg rounded-xl p-8 lg:p-12 shadow-2xl"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>

                            <div className="flex justify-center mb-6 lg:hidden">
                                <img src={logo} alt="OFHCINEMA Logo" className="h-16 w-auto object-contain" />
                            </div>

                            <h2 className="text-white text-3xl lg:text-4xl font-bold mb-2 text-center">
                                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                            </h2>
                            <p className="text-gray-400 text-center mb-8">
                                {isLogin ? 'Accede a tu cuenta de OFHCINEMA' : 'Únete a la comunidad cinéfila'}
                            </p>

                            <Form form={form} name="auth-form" onFinish={isLogin ? handleLogin : handleRegister}
                                layout="vertical" requiredMark={false} size="large">

                                {/* Nombre (solo en Registro) */}
                                {!isLogin && (
                                    <Form.Item name="nombre" rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}>
                                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nombre"
                                            className="!bg-gray-800 !text-white !border-gray-600 hover:!border-red-500 focus:!border-red-500 !h-14 !text-lg !rounded-lg"
                                            style={{ backgroundColor: '#1f2937', color: 'white' }} />
                                    </Form.Item>
                                )}

                                {/* Email */}
                                <Form.Item name="email" rules={[
                                    { required: true, message: 'Por favor ingresa tu email' },
                                    { type: 'email', message: 'Ingresa un email válido' }
                                ]}>
                                    <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email"
                                        className="!bg-gray-800 !text-white !border-gray-600 hover:!border-red-500 focus:!border-red-500 !h-14 !text-lg !rounded-lg"
                                        style={{ backgroundColor: '#1f2937', color: 'white' }} />
                                </Form.Item>

                                {/* Password */}
                                <Form.Item name="password" rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}>
                                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Contraseña"
                                        className="!bg-gray-800 !text-white !border-gray-600 hover:!border-red-500 focus:!border-red-500 !h-14 !text-lg !rounded-lg"
                                        style={{ backgroundColor: '#1f2937', color: 'white' }} />
                                </Form.Item>

                                <Form.Item className="mb-4 mt-8">
                                    <Button type="primary" htmlType="submit" loading={loading} block
                                        className="!h-14 !text-lg !font-bold !rounded-lg hover:!opacity-90 transition-opacity"
                                        style={{ backgroundColor: '#E50914', borderColor: '#E50914' }}>
                                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                    </Button>
                                </Form.Item>
                            </Form>

                            <div className="text-center mt-8 pt-6 border-t border-gray-700">
                                {isLogin ? (
                                    <p className="text-gray-400 text-lg">
                                        ¿Primera vez en OFHCINEMA?{' '}
                                        <span onClick={toggleMode} className="text-white font-semibold cursor-pointer hover:text-red-500 transition-colors underline underline-offset-4">
                                            Suscríbete ahora
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-gray-400 text-lg">
                                        ¿Ya tienes cuenta?{' '}
                                        <span onClick={toggleMode} className="text-white font-semibold cursor-pointer hover:text-red-500 transition-colors underline underline-offset-4">
                                            Inicia sesión
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="absolute bottom-4 left-0 right-0 text-gray-500 text-center text-sm z-20">
                    © 2025 OFHCINEMA. Todos los derechos reservados.
                </p>
            </div>
        </>
    );
};

export default LoginPage;
