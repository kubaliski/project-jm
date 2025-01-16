// src/store/auth/selectors/authSelectors.js

// Selectores básicos
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;

// Selectores para roles y permisos
export const selectUserRoles = (state) => state.auth.roles;
export const selectUserPermissions = (state) => state.auth.permissions;

// Selectores compuestos
export const selectHasPermission = (permission) => (state) =>
  state.auth.permissions.includes(permission);

export const selectHasRole = (roleName) => (state) =>
  state.auth.roles.some(role => role.name === roleName);

export const selectPermissionsByGroup = (state) => {
  const permissions = state.auth.permissions;
  return permissions.reduce((groups, permission) => {
    const [group] = permission.split('.');
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(permission);
    return groups;
  }, {});
};

// Selector para verificar múltiples permisos
export const selectHasPermissions = (permissions) => (state) =>
  permissions.every(permission => state.auth.permissions.includes(permission));