// UserRolesModal.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ReusableModal from '@components/common/ReusableModal';
import { SubmitButton } from '@components/common';
import UserRoleForm from './UserRoleForm';
import {
    selectRoles,
    selectRolesLoading,
    selectRolesError
} from '@store/admin/selectors/rolesSelectors';
import { selectSelectedUser } from '@/store/admin/selectors/usersSelectors';
import {
    fetchRoles
} from '@store/admin/thunks/rolesThunks';
import { assignUserRoles } from '@store/admin/thunks/usersThunks';


const UserRolesModal = ({
    isOpen,
    onClose,
    onSuccess,
    readOnly = false
}) => {
    const dispatch = useDispatch();
    const availableRoles = useSelector(selectRoles);
    const isLoading = useSelector(selectRolesLoading);
    const serverErrors = useSelector(selectRolesError);
    const user = useSelector(selectSelectedUser);

    const [selectedRole, setSelectedRole] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchRoles());
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (user?.roles?.length > 0) {
            setSelectedRole(user.roles[0].id);
        } else {
            setSelectedRole(null);
        }
        setErrors({});
    }, [user]);

    useEffect(() => {
        if (serverErrors) {
            setErrors({ general: serverErrors });
        }
    }, [serverErrors]);

    const handleRoleChange = (roleId) => {
        if (readOnly) return;

        setSelectedRole(roleId);
        setErrors(prev => ({ ...prev, role: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly || !user) return;

        if (!selectedRole) {
            setErrors({ role: 'Debe seleccionar un rol' });
            return;
        }

        try {
            setIsSubmitting(true);
            await dispatch(assignUserRoles({
                id: user.id,
                roles: [selectedRole]
            })).unwrap();

            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (error) {
            setErrors({
                general: error.message || 'Error al actualizar el rol'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title={`${readOnly ? 'Ver' : 'Gestionar'} rol - ${user.name} ${user.last_name}`}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-sm text-red-700">{errors.general}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Cargando roles...</p>
                    </div>
                ) : (
                    <UserRoleForm
                        selectedRole={selectedRole}
                        availableRoles={availableRoles}
                        onRoleChange={handleRoleChange}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        readOnly={readOnly}
                    />
                )}

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-4">
                    {readOnly ? (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cerrar
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </button>
                            <SubmitButton
                                isSubmitting={isSubmitting}
                                submitText="Guardar cambios"
                                loadingText="Guardando rol..."
                            />
                        </>
                    )}
                </div>
            </form>
        </ReusableModal>
    );
};

UserRolesModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        roles: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        }))
    }),
    onSuccess: PropTypes.func,
    readOnly: PropTypes.bool
};

export default UserRolesModal;