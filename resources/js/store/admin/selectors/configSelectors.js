// src/store/admin/selectors/configSelectors.js
export const selectEditorConfig = (state) => ({
    apiKey: state.admin.config.editor.apiKey
});
export const selectConfigLoading = (state) => state.admin.config.loading;
export const selectConfigError = (state) => state.admin.config.error;