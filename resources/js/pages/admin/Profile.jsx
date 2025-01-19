import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectUser,
    selectProfileLoading,
    selectProfileError
} from '@store/auth/selectors/authSelectors';
import { updateProfile } from '@store/auth/thunks/authThunks';
import { FormInput, SubmitButton, Paper, Button } from '@components/common';
import { useToast, useAuth } from '@/hooks';

const Profile = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { hasPermission } = useAuth();
    const user = useSelector(selectUser);
    const isLoading = useSelector(selectProfileLoading);
    const error = useSelector(selectProfileError);

    const canEditProfile = hasPermission('user.update-profile');

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                last_name: user.last_name || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            if (typeof error === 'object') {
                setFormErrors(error);
                const firstError = Object.values(error)[0];
                if (firstError && typeof firstError === 'string') {
                    toast.error(firstError);
                }
            } else {
                toast.error(error);
            }
        }
    }, [error, toast]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const resetPasswordFields = () => {
        setFormData(prev => ({
            ...prev,
            current_password: '',
            password: '',
            password_confirmation: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canEditProfile) return;

        setFormErrors({});
        const updateData = {
            name: formData.name,
            email: formData.email,
            last_name: formData.last_name
        };

        if (formData.password) {
            updateData.current_password = formData.current_password;
            updateData.password = formData.password;
            updateData.password_confirmation = formData.password_confirmation;
        }

        try {
            await dispatch(updateProfile(updateData)).unwrap();
            toast.success('Perfil actualizado correctamente');
            setIsEditing(false);
            resetPasswordFields();
        } catch (error) {
            // Los errores se manejan en el useEffect
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormErrors({});
        resetPasswordFields();
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                last_name: user.last_name || ''
            }));
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <Paper
                title="Perfil de Usuario"
                className="shadow-sm"

            >
                <div className="flex justify-between items-center mb-6">
                    {canEditProfile && !isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Editar Perfil
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        id="name"
                        name="name"
                        label="Nombre"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={formErrors.name}
                        readOnly={!isEditing}
                        required
                    />
                    <FormInput
                        id="last_name"
                        name="last_name"
                        label="Apellido"
                        type="text"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        error={formErrors.last_name}
                        readOnly={!isEditing}
                        required
                    />
                    <FormInput
                        id="email"
                        name="email"
                        label="Correo Electrónico"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={formErrors.email}
                        readOnly={!isEditing}
                        required
                    />

                    {isEditing && (
                        <>
                            <Paper
                                title="Cambiar Contraseña"
                                className="mt-6 bg-gray-50"
                                titleLevel="h4"
                            >
                                <div className="space-y-4">
                                    <FormInput
                                        id="current_password"
                                        name="current_password"
                                        label="Contraseña Actual"
                                        type="password"
                                        value={formData.current_password}
                                        onChange={handleInputChange}
                                        error={formErrors.current_password}
                                    />
                                    <FormInput
                                        id="password"
                                        name="password"
                                        label="Nueva Contraseña"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={formErrors.password}
                                    />
                                    <FormInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        label="Confirmar Nueva Contraseña"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        error={formErrors.password_confirmation}
                                    />
                                </div>
                            </Paper>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancelar
                                </Button>

                                <SubmitButton
                                    isSubmitting={isLoading}
                                    isUpdate={true}
                                    updateText="Guardar Cambios"
                                    loadingText="Guardando..."
                                />
                            </div>
                        </>
                    )}
                </form>
            </Paper>
        </div>
    );
};

export default Profile;