import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PencilIcon, TrashIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import {
    Table,
    TableFilters,
    ConfirmationDialog,
    Paper,
    Button,
    ExcelDownloadButton,
} from "@components/common";
import { BannerModal } from "@/features/banner/admin";
import { formatDateForDisplay } from "@utils/dateUtils";
import { bannersTableConfig } from "@config/tables/bannersTable";
import {
    selectPaginatedBanners,
    selectBannersLoading,
    selectFilteredAndSortedBanners,
    selectBannersFilters,
    selectBannersSortConfig,
    selectBannersPagination,
    selectEditModalState,
    selectDeleteModalState,
    selectSelectedBanner,
} from "@store/admin/selectors/bannersSelectors";
import {
    fetchBanners,
    deleteBanner,
    updateBannerPriority
} from "@store/admin/thunks/bannersThunks";
import {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setSelectedBanner,
    setEditModalState,
    setDeleteModalState,
} from "@store/admin/slices/bannersSlice";
import { useAuth, useToast } from "@hooks";

export default function BannersList() {
    const dispatch = useDispatch();
    const { hasPermission } = useAuth();
    const toast = useToast();

    // Selectores
    const paginatedBanners = useSelector(selectPaginatedBanners);
    const isLoading = useSelector(selectBannersLoading);
    const filters = useSelector(selectBannersFilters);
    const sortConfig = useSelector(selectBannersSortConfig);
    const { currentPage, itemsPerPage } = useSelector(selectBannersPagination);
    const editModalState = useSelector(selectEditModalState);
    const deleteModalState = useSelector(selectDeleteModalState);
    const filteredBanners = useSelector(selectFilteredAndSortedBanners);
    const selectedBanner = useSelector(selectSelectedBanner);

    // Permisos memoizados
    const permissions = useMemo(() => ({
        viewList: hasPermission("banner.index"),
        view: hasPermission("banner.view"),
        edit: hasPermission("banner.edit"),
        delete: hasPermission("banner.delete"),
        create: hasPermission("banner.create"),
        updatePriority: hasPermission("banner.update-priority"),
        download: hasPermission("banner.download"),
    }), [hasPermission]);

    // Carga inicial de datos
    useEffect(() => {
        if (!permissions.viewList) return;

        dispatch(fetchBanners())
            .unwrap()
            .catch(error => {
                toast.error("Error al cargar los banners: " + error.message);
            });
    }, []);

    // Handlers
    const handleCreateClick = useCallback(() => {
        if (permissions.create) {
            dispatch(setSelectedBanner(null));
            dispatch(setEditModalState({ isOpen: true, mode: "create" }));
        } else {
            toast.warning("No tienes permisos para crear banners");
        }
    }, [permissions.create, dispatch, toast]);

    const handleEditClick = useCallback((banner) => {
        if (permissions.edit || (permissions.view && !permissions.edit)) {
            dispatch(setSelectedBanner(banner));
            dispatch(
                setEditModalState({
                    isOpen: true,
                    mode: permissions.edit ? "edit" : "view",
                })
            );
        } else {
            toast.warning("No tienes permisos para ver/editar banners");
        }
    }, [permissions.edit, permissions.view, dispatch, toast]);

    const handleDeleteClick = useCallback((banner) => {
        if (permissions.delete) {
            dispatch(setSelectedBanner(banner));
            dispatch(setDeleteModalState({ isOpen: true }));
        } else {
            toast.warning("No tienes permisos para eliminar banners");
        }
    }, [permissions.delete, dispatch, toast]);

    const handleUpdatePriority = useCallback(async (banner, direction) => {
        if (!permissions.updatePriority) {
            toast.warning("No tienes permisos para modificar la prioridad");
            return;
        }

        const newPriority = direction === 'up' ? banner.priority + 1 : banner.priority - 1;
        if (newPriority < 0) return;

        try {
            await dispatch(updateBannerPriority({ id: banner.id, priority: newPriority })).unwrap();
            await dispatch(fetchBanners()).unwrap();
            toast.success("Prioridad actualizada correctamente");
        } catch (error) {
            toast.error("Error al actualizar la prioridad: " + error.message);
        }
    }, [permissions.updatePriority, dispatch, toast]);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedBanner || !permissions.delete) return;

        try {
            await dispatch(deleteBanner(selectedBanner.id)).unwrap();
            toast.success("Banner eliminado correctamente");
            dispatch(setDeleteModalState({ isOpen: false }));
            dispatch(setSelectedBanner(null));
            await dispatch(fetchBanners()).unwrap();
        } catch (error) {
            toast.error("Error al eliminar el banner: " + error.message);
        }
    }, [selectedBanner, permissions.delete, dispatch, toast]);

    const handleModalSuccess = useCallback(async (action) => {
        try {
            await dispatch(fetchBanners()).unwrap();
            toast.success(
                action === "create"
                    ? "Banner creado correctamente"
                    : "Banner actualizado correctamente"
            );
        } catch (error) {
            toast.error("Error al actualizar la lista de banners: " + error.message);
        }
    }, [dispatch, toast]);

    // Componentes de UI
    const getStatusBadge = (banner) => {
        const now = new Date();
        // Establecer la hora a 00:00:00 para la fecha actual
        now.setHours(0, 0, 0, 0);

        const startDate = banner.start_date ? new Date(banner.start_date) : null;
        const endDate = banner.end_date ? new Date(banner.end_date) : null;

        // Establecer la hora a 00:00:00 para las fechas de comparación
        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(0, 0, 0, 0);

        if (!banner.is_active) {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Inactivo
                </span>
            );
        }

        if (startDate && startDate > now) {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Programado
                </span>
            );
        }

        if (endDate && endDate < now) {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Expirado
                </span>
            );
        }

        return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Activo
            </span>
        );
    };

    const columns = useMemo(() =>  [
        {
            key: "text",
            header: "Texto",
            render: (banner) => (
                <div
                    className="p-2 rounded text-sm font-medium"
                    style={{
                        color: banner.text_color,
                        backgroundColor: banner.background_color
                    }}
                >
                    {banner.text}
                </div>
            ),
        },
        {
            key: "status",
            header: "Estado",
            render: getStatusBadge,
        },
        {
            key: "dates",
            header: "Fechas",
            render: (banner) => {
                // Opciones para mostrar solo la fecha sin hora
                const dateOptions = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: undefined,
                    minute: undefined
                };

                return (
                    <div className="text-sm text-gray-500">
                        {banner.start_date && (
                            <div>Inicio: {formatDateForDisplay(banner.start_date, dateOptions)}</div>
                        )}
                        {banner.end_date && (
                            <div>Fin: {formatDateForDisplay(banner.end_date, dateOptions)}</div>
                        )}
                    </div>
                );
            },
        },
        {
            key: "priority",
            header: "Prioridad",
            render: (banner) => (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{banner.priority}</span>
                    {permissions.updatePriority && (
                        <div className="flex flex-col">
                            <button
                                onClick={() => handleUpdatePriority(banner, 'up')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <ArrowUpIcon className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleUpdatePriority(banner, 'down')}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={banner.priority === 0}
                            >
                                <ArrowDownIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            render: (banner) => (
                <div className="flex justify-end space-x-2">
                    {(permissions.view || permissions.edit) && (
                        <button
                            onClick={() => handleEditClick(banner)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title={permissions.edit ? "Editar" : "Ver"}
                        >
                            {permissions.edit ? (
                                <PencilIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                    {permissions.delete && (
                        <button
                            onClick={() => handleDeleteClick(banner)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ),
        },
    ], [permissions, handleEditClick, handleDeleteClick, handleUpdatePriority]);

    if (!permissions.viewList) {
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
                title="Banners"
                titleLevel="h1"
                subtitle="Gestión de banners informativos"
            />

            <Paper contentClassName="space-y-4">
                <div className="flex space-x-4">
                    {permissions.create && (
                        <Button onClick={handleCreateClick}>Crear banner</Button>
                    )}
                    {permissions.download && (
                        <ExcelDownloadButton
                            data={filteredBanners}
                            filename="banners.xlsx"
                            columns={columns}
                            hasPermission={permissions.download}
                            isLoading={isLoading}
                        />
                    )}
                </div>
                <TableFilters
                    config={bannersTableConfig}
                    filters={filters}
                    sortConfig={sortConfig}
                    onFilterChange={(key, value) => dispatch(setFilters({ ...filters, [key]: value }))}
                    onSortChange={(field, direction) => dispatch(setSortConfig({ field, direction }))}
                />

                <Table
                    columns={columns}
                    data={paginatedBanners}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredBanners.length / itemsPerPage)}
                    totalItems={filteredBanners.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => dispatch(setCurrentPage(page))}
                    emptyMessage="No hay banners creados"
                    mainColumn="text"
                />
            </Paper>

            <BannerModal
                isOpen={editModalState.isOpen}
                mode={editModalState.mode}
                onClose={() => dispatch(setEditModalState({ isOpen: false, mode: null }))}
                onSuccess={() => handleModalSuccess(editModalState.mode)}
            />

            <ConfirmationDialog
                isOpen={deleteModalState.isOpen}
                onClose={() => {
                    dispatch(setDeleteModalState({ isOpen: false }));
                    dispatch(setSelectedBanner(null));
                }}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar este banner?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmButtonStyle="danger"
            />
        </div>
    );
}