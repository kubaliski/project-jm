import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper } from '@components/common';
import { AppInfoForm } from '@features/appInfo';
import { useAuth, useToast } from '@hooks';

// Import thunks and selectors
import { fetchAppInfo } from '@store/landing/thunks/publicAppInfoThunks';
import { updateAppInfo } from '@store/admin/thunks/appInfoThunks';
import {
    selectAdminAppInfo,
    selectAdminAppInfoLoading,
    selectAdminAppInfoError,
} from '@store/admin/selectors/appInfoSelectors';

export default function AppInfo() {
    const dispatch = useDispatch();
    const { hasPermission } = useAuth();
    const toast = useToast();

    // Selectors
    const appInfo = useSelector(selectAdminAppInfo);
    const isLoading = useSelector(selectAdminAppInfoLoading);
    const error = useSelector(selectAdminAppInfoError);

    // Permissions check
    const permissions = {
        view: hasPermission('appinfo.index'),
        edit: hasPermission('appinfo.update')
    };

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            if (permissions.view) {
                try {
                    await dispatch(fetchAppInfo()).unwrap();
                } catch (error) {
                    toast.error('Error al cargar la información: ' + error.message);
                }
            }
        };

        loadData();
    }, [dispatch, permissions.view]);

    const handleSubmit = async (formData) => {
        if (!permissions.edit) {
            toast.warning('No tienes permisos para editar la información');
            return;
        }

        try {
            await dispatch(updateAppInfo({
                id: appInfo.id,
                formData
            })).unwrap();
            toast.success('Información actualizada correctamente');
        } catch (error) {
            toast.error('Error al actualizar la información: ' + error.message);
        }
    };

    if (!permissions.view) {
        return (
            <Paper title="Acceso denegado" titleLevel="h1">
                <p className="text-gray-500">
                    No tienes permisos para ver esta sección.
                </p>
            </Paper>
        );
    }

    return (
        <div className="space-y-6">
            <Paper
                title="Información de la Aplicación"
                titleLevel="h1"
                subtitle="Gestión de la información general de la aplicación"
            />

            <Paper>
                {error && (
                    <div className="rounded-md bg-red-50 p-4 mb-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error al cargar la información
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    {error}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <AppInfoForm
                    initialData={appInfo}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    readOnly={!permissions.edit}
                />
            </Paper>
        </div>
    );
}