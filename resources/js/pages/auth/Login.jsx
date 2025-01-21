// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks';
import { FormInput, SubmitButton } from '@components/common';
import {ForgotPasswordModal} from '@features/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const error = localError || authError;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Acceso al Panel
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div className="space-y-4">
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
                        />

                        <FormInput
                            id="password"
                            name="password"
                            type="password"
                            label="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                ¿Has olvidado la contraseña?
                            </button>
                        </div>
                    </div>

                    <div>
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            submitText="Acceder"
                            loadingText="Accediendo..."
                            className="w-full"
                        />
                    </div>
                </form>
            </div>

            <ForgotPasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}