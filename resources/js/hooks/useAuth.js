import { useSelector, useDispatch } from "react-redux";
import useToast from "./useToast"; // Ajusta la ruta según tu estructura

import {
    selectUser,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
    selectUserPermissions,
    selectUserRoles,
} from "@store/auth/selectors/authSelectors";
import {
    loginUser,
    logoutUser,
    getCurrentUser,
} from "@store/auth/thunks/authThunks";

const useAuth = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const permissions = useSelector(selectUserPermissions) || [];
    const roles = useSelector(selectUserRoles) || [];

    const login = async (credentials) => {
        try {
            const resultAction = await dispatch(loginUser(credentials));
            if (loginUser.fulfilled.match(resultAction)) {
                toast.success("Inicio de sesión exitoso");
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.message || "Error al iniciar sesión");
            return false;
        }
    };

    const logout = async () => {
        try {
            await dispatch(logoutUser());
            localStorage.removeItem("token");
            toast.success("Sesión cerrada exitosamente");
            return true;
        } catch (error) {
            toast.error("Error al cerrar sesión");
            console.error("Error durante el logout:", error);
            return false;
        }
    };

    const checkAuth = async () => {
        try {
            await dispatch(getCurrentUser());
        } catch (error) {
            toast.error("Error al verificar la autenticación");
            console.error("Error verificando autenticación:", error);
        }
    };

    const hasPermission = (permission) => {
        return Array.isArray(permissions) && permissions.includes(permission);
    };

    const hasRole = (roleName) => {
        return (
            Array.isArray(roles) && roles.some((role) => role.name === roleName)
        );
    };

    return {
        user,
        login,
        logout,
        loading,
        error,
        checkAuth,
        isAuthenticated,
        hasPermission,
        hasRole,
        permissions,
        roles,
    };
};

export default useAuth;
