import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks';
import { FormInput, SubmitButton, Paper } from '@components/common';
import { ForgotPasswordModal } from '@features/auth';
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon  } from '@heroicons/react/24/outline';



export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, error: authError, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setIsSubmitting(true);

        try {
            const success = await login({ email, password });
            if (!success) {
                setLocalError('Credenciales inválidas');
            }
        } catch {
            setLocalError('Error al intentar iniciar sesión');
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const error = localError || authError;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            <Paper className="w-full max-w-md" showDivider={false}>
                <div className="text-center mb-8">
                    <div className="mx-auto w-14 h-14 bg-indigo-100 flex items-center justify-center rounded-full">
                        <LockClosedIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Acceso al Panel
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                            <div className="text-sm text-red-700 font-medium">{error}</div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <FormInput
                                id="email"
                                name="email"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                disabled={isSubmitting}
                                className="pl-10"
                            />
                            <div className="absolute top-[34px] left-3 text-gray-400 pointer-events-none">
                                <EnvelopeIcon className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="relative">
                            <FormInput
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                label="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                required
                                disabled={isSubmitting}
                                className="pl-10 pr-10"
                            />
                            <div className="absolute top-[34px] left-3 text-gray-400 pointer-events-none">
                                <LockClosedIcon className="h-5 w-5" />
                            </div>
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-[34px] right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        >
                            ¿Has olvidado la contraseña?
                        </button>
                    </div>

                    <div>
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            submitText="Acceder"
                            loadingText="Accediendo..."
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        />
                    </div>
                </form>
            </Paper>

            <ForgotPasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}