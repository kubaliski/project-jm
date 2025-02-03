// src/features/auth/components/ForgotPasswordModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ReusableModal, FormInput, SubmitButton } from '@components/common';
import {useToast} from '@/hooks';
import { forgotPassword } from '@store/auth/thunks/authThunks';
import {
    selectPasswordResetLoading,
    selectPasswordResetSuccess,
    selectPasswordResetError,
    selectPasswordResetMessage
} from '@store/auth/selectors/authSelectors';
import { clearPasswordResetStatus } from '@store/auth/slices/authSlice';

export default function ForgotPasswordModal({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const toast = useToast();

    const isLoading = useSelector(selectPasswordResetLoading);
    const success = useSelector(selectPasswordResetSuccess);
    const error = useSelector(selectPasswordResetError);
    const message = useSelector(selectPasswordResetMessage);

    // Manejar el mensaje de éxito
    useEffect(() => {
        if (success && message) {
            toast.success(message);
            handleClose();
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, message]);

    // Manejar errores
    useEffect(() => {
        if (error) {
            const errorMessage = typeof error === 'string'
                ? error
                : 'Error al procesar la solicitud';
            toast.error(errorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(forgotPassword(email ));
    };

    const handleClose = () => {
        setEmail('');
        dispatch(clearPasswordResetStatus());
        onClose();
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Recuperar contraseña"
            size="sm"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    id="reset-email"
                    name="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                />
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancelar
                    </button>
                    <SubmitButton
                        isSubmitting={isLoading}
                        submitText="Enviar enlace"
                        loadingText="Enviando..."
                    />
                </div>
            </form>
        </ReusableModal>
    );
}

ForgotPasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};