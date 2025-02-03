// UserModal.jsx
import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import ReusableModal from "@components/common/ReusableModal";
import UserForm from "./UserForm";
import {
    selectSelectedUser,
    selectUsersLoading,
} from "@store/admin/selectors/usersSelectors";
import {
    selectRoles,
    selectRolesLoading,
} from "@store/admin/selectors/rolesSelectors";
import { createUser, updateUser } from "@store/admin/thunks/usersThunks";
import { setSelectedUser } from "@store/admin/slices/usersSlice";

const UserModal = ({
    isOpen,
    mode,
    onClose,
    onSuccess,
    readOnly = false,
    canEditRoles,
    canRenderRoles,
    canChangePassword }) => {

    const dispatch = useDispatch();
    const selectedUser = useSelector(selectSelectedUser);
    const isLoading = useSelector(selectUsersLoading);
    const roles = useSelector(selectRoles);
    const rolesLoading = useSelector(selectRolesLoading);

    const handleClose = () => {
        dispatch(setSelectedUser(null));
        onClose();
    };

    const handleSubmit = async (formData) => {
        if (mode === "edit" && selectedUser) {
            await dispatch(
                updateUser({
                    id: selectedUser.id,
                    formData: {
                        ...formData,
                        ...(formData.password
                            ? { password: formData.password }
                            : {}),
                    },
                })
            ).unwrap();
        } else {
            await dispatch(createUser(formData)).unwrap();
        }
        handleClose();
        if (onSuccess) {
            onSuccess();
        }
    };

    const getModalTitle = () => {
        switch (mode) {
            case "view":
                return "Ver Usuario";
            case "edit":
                return "Editar Usuario";
            default:
                return "Nuevo Usuario";
        }
    };

    const isSubmitting = isLoading || rolesLoading;

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={handleClose}
            title={getModalTitle()}
            size="2xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <UserForm
                    user={selectedUser}
                    roles={roles}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isSubmitting}
                    readOnly={readOnly || mode === "view"}
                    mode={mode}
                    canEditRoles={canEditRoles}
                    canRenderRoles={canRenderRoles}
                    canChangePassword={canChangePassword}
                />
            </div>
        </ReusableModal>
    );
};

UserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(["create", "edit", "view"]),
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    readOnly: PropTypes.bool,
    canEditRoles: PropTypes.bool,
    canRenderRoles: PropTypes.bool,
    canChangePassword: PropTypes.bool,
};

export default UserModal;
