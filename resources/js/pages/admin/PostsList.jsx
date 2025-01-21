import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
    Table,
    TableFilters,
    ConfirmationDialog,
    Paper,
    Button,
} from "@components/common";
import { PostModal } from "@/features/posts";
import { formatDateForDisplay, isFutureDate } from "@utils/dateUtils";
import { postsTableConfig } from "@config/tables/postsTable";
import {
    selectPaginatedPosts,
    selectPostsLoading,
    selectFilteredAndSortedPosts,
    selectPostsFilters,
    selectPostsSortConfig,
    selectPostsPagination,
    selectEditModalState,
    selectDeleteModalState,
    selectSelectedPost,
    selectTotalPosts,
    selectPostStatsLoading,
} from "@store/admin/selectors/postsSelectors";
import {
    fetchPosts,
    deletePost,
    countPosts,
} from "@store/admin/thunks/postsThunks";
import {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setSelectedPost,
    setEditModalState,
    setDeleteModalState,
} from "@store/admin/slices/postsSlice";
import { useAuth, useToast } from "@hooks";

export default function PostsList() {
    const dispatch = useDispatch();
    const { hasPermission } = useAuth();
    const toast = useToast();

    // Selectores
    const paginatedPosts = useSelector(selectPaginatedPosts);
    const isLoading = useSelector(selectPostsLoading);
    const filters = useSelector(selectPostsFilters);
    const sortConfig = useSelector(selectPostsSortConfig);
    const { currentPage, itemsPerPage } = useSelector(selectPostsPagination);
    const editModalState = useSelector(selectEditModalState);
    const deleteModalState = useSelector(selectDeleteModalState);
    const filteredPosts = useSelector(selectFilteredAndSortedPosts);
    const selectedPost = useSelector(selectSelectedPost);
    const totalPosts = useSelector(selectTotalPosts);
    const isStatsLoading = useSelector(selectPostStatsLoading);

    // Permisos memoizados
    const permissions = useMemo(() => ({
        viewList: hasPermission("post.index"),
        view: hasPermission("post.view"),
        edit: hasPermission("post.edit"),
        delete: hasPermission("post.delete"),
        create: hasPermission("post.create"),
        viewStats: hasPermission("stats.contacts")
    }), [hasPermission]);

    // Carga inicial de datos
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (!permissions.viewList) return;

                const loadPromises = [dispatch(fetchPosts()).unwrap()];
                if (permissions.viewStats) {
                    loadPromises.push(dispatch(countPosts()).unwrap());
                }
                await Promise.all(loadPromises);
            } catch (error) {
                toast.error("Error al cargar los posts: " + error.message);
            }
        };

        fetchInitialData();
    }, []);

    // Handlers
    const handleCreateClick = useCallback(() => {
        if (permissions.create) {
            dispatch(setSelectedPost(null));
            dispatch(setEditModalState({ isOpen: true, mode: "create" }));
        } else {
            toast.warning("No tienes permisos para crear posts");
        }
    }, [permissions.create, dispatch, toast]);

    const handleEditClick = useCallback((post) => {
        if (permissions.edit || (permissions.view && !permissions.edit)) {
            dispatch(setSelectedPost(post));
            dispatch(
                setEditModalState({
                    isOpen: true,
                    mode: permissions.edit ? "edit" : "view",
                })
            );
        } else {
            toast.warning("No tienes permisos para ver/editar posts");
        }
    }, [permissions.edit, permissions.view, dispatch, toast]);

    const handleDeleteClick = useCallback((post) => {
        if (permissions.delete) {
            dispatch(setSelectedPost(post));
            dispatch(setDeleteModalState({ isOpen: true }));
        } else {
            toast.warning("No tienes permisos para eliminar posts");
        }
    }, [permissions.delete, dispatch, toast]);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedPost || !permissions.delete) return;

        try {
            await dispatch(deletePost(selectedPost.id)).unwrap();
            toast.success(`El post "${selectedPost.title}" ha sido eliminado`);

            dispatch(setDeleteModalState({ isOpen: false }));
            dispatch(setSelectedPost(null));

            const loadPromises = [dispatch(fetchPosts()).unwrap()];
            if (permissions.viewStats) {
                loadPromises.push(dispatch(countPosts()).unwrap());
            }
            await Promise.all(loadPromises);
        } catch (error) {
            toast.error("Error al eliminar el post: " + error.message);
        }
    }, [selectedPost, permissions.delete, permissions.viewStats, dispatch, toast]);

    const handleModalSuccess = useCallback(async (action) => {
        try {
            const loadPromises = [dispatch(fetchPosts()).unwrap()];
            if (permissions.viewStats) {
                loadPromises.push(dispatch(countPosts()).unwrap());
            }
            await Promise.all(loadPromises);

            toast.success(
                action === "create"
                    ? "Post creado correctamente"
                    : "Post actualizado correctamente"
            );
        } catch (error) {
            toast.error("Error al actualizar la lista de posts: " + error.message);
        }
    }, [permissions.viewStats, dispatch, toast]);

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({
            ...filters,
            [key]: value,
        }));
    };

    const handleSortChange = (field, direction) => {
        dispatch(setSortConfig({ field, direction }));
    };

    // Componentes de UI
    const getStatusBadge = (post) => {
        if (post.is_published) {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Publicado
                </span>
            );
        } else if (post.published_at && isFutureDate(post.published_at)) {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Programado ({formatDateForDisplay(post.published_at)})
                </span>
            );
        } else {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Borrador
                </span>
            );
        }
    };

    const columns = useMemo(() =>  [
        {
            key: "title",
            header: "Título",
            render: (post) => (
                <>
                    <div className="text-sm font-medium text-gray-900">
                        {post.title}
                    </div>
                    {post.excerpt && (
                    <div className="text-sm text-gray-500 max-w-[150px] md:max-w-xs truncate">
                        {post.excerpt}
                    </div>
                )}
                </>
            ),
        },
        {
            key: "status",
            header: "Estado",
            render: getStatusBadge,
        },
        {
            key: "created_at",
            header: "Fecha de creación",
            render: (post) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(post.created_at)}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Acciones",
            className: "text-right",
            cellClassName: "text-right",
            render: (post) => (
                <>
                    {(permissions.view || permissions.edit) && (
                        <button
                            onClick={() => handleEditClick(post)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
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
                            onClick={() => handleDeleteClick(post)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </>
            ),
        },
    ], [permissions, handleEditClick, handleDeleteClick]);

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
                title="Posts"
                titleLevel="h1"
                subtitle="Listado de posts y artículos"
                contentClassName="sm:flex sm:items-center sm:justify-between"
            >
                <div>
                    {permissions.viewStats && !isStatsLoading && (
                        <p className="mt-1 text-sm text-gray-500">
                            Total de posts: {totalPosts}
                        </p>
                    )}
                </div>
            </Paper>

            <Paper contentClassName="space-y-4">
                {permissions.create && (
                    <Button onClick={handleCreateClick}>Crear post</Button>
                )}
                <TableFilters
                    config={postsTableConfig}
                    filters={filters}
                    sortConfig={sortConfig}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
                <Table
                    columns={columns}
                    data={paginatedPosts}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredPosts.length / itemsPerPage)}
                    totalItems={filteredPosts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => dispatch(setCurrentPage(page))}
                    emptyMessage="No hay posts creados"
                    mainColumn="title"
                />
            </Paper>

            <PostModal
                isOpen={editModalState.isOpen}
                mode={editModalState.mode}
                onClose={() => dispatch(setEditModalState({ isOpen: false, mode: null }))}
                onSuccess={() => handleModalSuccess(editModalState.mode)}
            />

            <ConfirmationDialog
                isOpen={deleteModalState.isOpen}
                onClose={() => {
                    dispatch(setDeleteModalState({ isOpen: false }));
                    dispatch(setSelectedPost(null));
                }}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar el post "${selectedPost?.title}"?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmButtonStyle="danger"
            />
        </div>
    );
}