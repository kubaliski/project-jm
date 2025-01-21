// Selectores existentes...
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;
export const selectUserRoles = (state) => state.auth.roles;
export const selectUserPermissions = (state) => state.auth.permissions;
export const selectProfileLoading = (state) => state.auth.profile.loading;
export const selectProfileError = (state) => state.auth.profile.error;

// Nuevos selectores para password reset
export const selectPasswordResetLoading = (state) => state.auth.passwordReset.loading;
export const selectPasswordResetError = (state) => state.auth.passwordReset.error;
export const selectPasswordResetSuccess = (state) => state.auth.passwordReset.success;
export const selectPasswordResetMessage = (state) => state.auth.passwordReset.message;

// Selectores compuestos existentes...
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

export const selectHasPermissions = (permissions) => (state) =>
  permissions.every(permission => state.auth.permissions.includes(permission));