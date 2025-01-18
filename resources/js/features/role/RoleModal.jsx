import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ReusableModal from '@components/common/ReusableModal';
import RoleForm from './RoleForm';
import {
    selectSelectedRole,
    selectRolesLoading
} from '@store/admin/selectors/rolesSelectors';
import {
    createRole,
    updateRole
} from '@store/admin/thunks/rolesThunks';
import {
    setEditModalState,
    setSelectedRole
} from '@store/admin/slices/rolesSlice';

export default function RoleModal({ isOpen, mode, onClose, onSuccess, readOnly = false }) {
    const dispatch = useDispatch();
    const selectedRole = useSelector(selectSelectedRole);
    const isLoading = useSelector(selectRolesLoading);

    const handleClose = () => {
        dispatch(setSelectedRole(null));
        onClose();
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === 'edit' && selectedRole) {
                await dispatch(updateRole({
                    id: selectedRole.id,
                    formData
                })).unwrap();
            } else {
                await dispatch(createRole(formData)).unwrap();
            }
            handleClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={handleClose}
            title={mode === 'view'
                ? 'Ver Rol'
                : mode === 'edit'
                    ? 'Editar Rol'
                    : 'Nuevo Rol'}
            size="2xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <RoleForm
                    role={selectedRole}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isLoading}
                    readOnly={readOnly || mode === 'view'}
                />
            </div>
        </ReusableModal>
    );
}

RoleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['create', 'edit', 'view']),
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    readOnly: PropTypes.bool
};