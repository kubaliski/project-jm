import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import ReusableModal from "@components/common/ReusableModal";
import RolePermissionsForm from "./RolePermissionsForm";
import {
    selectSelectedRole,
    selectPermissionsByGroup,
    selectRolesLoading,
} from "@store/admin/selectors/rolesSelectors";
import { updateRolePermissions } from "@store/admin/thunks/rolesThunks";
import {
    setPermissionsModalState,
    setSelectedRole,
} from "@store/admin/slices/rolesSlice";

export default function RolePermissionsModal({
    isOpen,
    onClose,
    onSuccess,
    readOnly = false,
}) {
    const dispatch = useDispatch();
    const selectedRole = useSelector(selectSelectedRole);
    const permissions = useSelector(selectPermissionsByGroup);
    const isLoading = useSelector(selectRolesLoading);

    const handleClose = () => {
        dispatch(setPermissionsModalState({ isOpen: false }));
        dispatch(setSelectedRole(null));
        onClose?.();
    };

    const handleSubmit = async (selectedPermissionIds) => {
        if (!selectedRole?.id) return;

        // Convertir IDs a nombres de permisos
        const permissionNames = selectedPermissionIds
            .map((id) => {
                let permissionName;
                Object.values(permissions).some((group) => {
                    const found = group.find((p) => p.id === id);
                    if (found) {
                        permissionName = found.name;
                        return true;
                    }
                    return false;
                });
                return permissionName;
            })
            .filter(Boolean);

        await dispatch(
            updateRolePermissions({
                id: selectedRole.id,
                permissions: permissionNames,
            })
        ).unwrap();

        if (onSuccess) {
            onSuccess();
        }
        handleClose();
    };

    // Si no hay rol seleccionado o permisos, no renderizamos nada
    if (
        !selectedRole?.id ||
        !permissions ||
        Object.keys(permissions).length === 0
    ) {
        return null;
    }

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Gestionar Permisos - ${selectedRole.name}`}
            size="4xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <RolePermissionsForm
                    role={selectedRole}
                    permissions={permissions}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isLoading}
                    readOnly={readOnly}
                />
            </div>
        </ReusableModal>
    );
}

RolePermissionsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    readOnly: PropTypes.bool,
};
