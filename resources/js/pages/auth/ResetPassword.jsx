// src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormInput, SubmitButton } from '@components/common';
import useToast from '@/hooks/useToast';
import { resetPassword } from '@store/auth/thunks/authThunks';
import {
    selectPasswordResetLoading,
    selectPasswordResetSuccess,
    selectPasswordResetError
} from '@store/auth/selectors/authSelectors';
import { clearPasswordResetStatus } from '@store/auth/slices/authSlice';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        email: searchParams.get('email') || '',
        password: '',
        password_confirmation: '',
        token: searchParams.get('token') || ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const isLoading = useSelector(selectPasswordResetLoading);
    const success = useSelector(selectPasswordResetSuccess);
    const error = useSelector(selectPasswordResetError);

    useEffect(() => {
        // Si no hay token o email, redirigir al login
        if (!formData.token || !formData.email) {
            toast.error('Enlace de recuperación inválido');
            navigate('/login');
        }
    }, [formData.token, formData.email, navigate, toast]);

    useEffect(() => {
        if (success) {
            toast.success('Contraseña actualizada correctamente');
            dispatch(clearPasswordResetStatus());
            navigate('/login');
        }
    }, [success, dispatch, navigate, toast]);

    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'Error al restablecer la contraseña');
        }
    }, [error,toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(resetPassword(formData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Restablecer contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <FormInput
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly
                            required
                        />

                        <FormInput
                            id="password"
                            name="password"
                            type="password"
                            label="Nueva contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <FormInput
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            label="Confirmar contraseña"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <SubmitButton
                            isSubmitting={isLoading}
                            submitText="Restablecer contraseña"
                            loadingText="Procesando..."
                            className="w-full"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}