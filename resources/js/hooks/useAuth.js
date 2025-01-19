// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserPermissions,
  selectUserRoles
} from '@store/auth/selectors/authSelectors';
import {
  loginUser,
  logoutUser,
  getCurrentUser
} from '@store/auth/thunks/authThunks';

const useAuth = () => {
  const dispatch = useDispatch();
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
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser());
      // Asegurarnos de que todo se limpie
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Error durante el logout:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      await dispatch(getCurrentUser());
    } catch (error) {
      console.error('Error verificando autenticación:', error);
    }
  };

  const hasPermission = (permission) => {
    return Array.isArray(permissions) && permissions.includes(permission);
  };

  const hasRole = (roleName) => {
    return Array.isArray(roles) && roles.some(role => role.name === roleName);
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
    roles
  };
};

export default useAuth;