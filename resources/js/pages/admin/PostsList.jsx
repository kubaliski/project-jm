import React, { useEffect } from "react";
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
import { useAuth } from "@hooks";

export default function PostsList() {
    const dispatch = useDispatch();
    const { permissions } = useAuth();

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

    // Permisos
    const canViewList = permissions.includes("post.index");
    const canView = permissions.includes("post.view");
    const canEdit = permissions.includes("post.edit");
    const canDelete = permissions.includes("post.delete");
    const canCreate = permissions.includes("post.create");
    const canViewStats = permissions.includes("stats.contacts");

    useEffect(() => {
        if (canViewList) {
            dispatch(fetchPosts());
        }
        if (canViewStats) {
            dispatch(countPosts());
        }
    }, [dispatch, canViewList, canViewStats]);

    const handleCreateClick = () => {
        if (canCreate) {
            dispatch(setSelectedPost(null));
            dispatch(setEditModalState({ isOpen: true, mode: "create" }));
        }
    };

    const handleEditClick = (post) => {
        if (canEdit || (canView && !canEdit)) {
            dispatch(setSelectedPost(post));
            dispatch(
                setEditModalState({
                    isOpen: true,
                    mode: canEdit ? "edit" : "view",
                })
            );
        }
    };

    const handleDeleteClick = (post) => {
        if (canDelete) {
            dispatch(setSelectedPost(post));
            dispatch(setDeleteModalState({ isOpen: true }));
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedPost) return;
        if (canDelete && selectedPost) {
            try {
                await dispatch(deletePost(selectedPost.id)).unwrap();
                dispatch(setDeleteModalState({ isOpen: false }));
                dispatch(setSelectedPost(null));

                if (canViewStats) {
                    dispatch(countPosts());
                }
            } catch (error) {
                console.error("Error al eliminar el post:", error);
            }
        }
    };

    const handleFilterChange = (key, value) => {
        dispatch(
            setFilters({
                ...filters,
                [key]: value,
            })
        );
    };

    const handleSortChange = (field, direction) => {
        dispatch(setSortConfig({ field, direction }));
    };

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

    const columns = [
        {
            key: "title",
            header: "Título",
            render: (post) => (
                <>
                    <div className="text-sm font-medium text-gray-900">
                        {post.title}
                    </div>
                    {post.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                            {post.excerpt}
                        </div>
                    )}
                </>
            ),
        },
        {
            key: "status",
            header: "Estado",
            render: (post) => getStatusBadge(post),
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
                    {(canView || canEdit) && (
                        <button
                            onClick={() => handleEditClick(post)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title={canEdit ? "Editar" : "Ver"}
                        >
                            {canEdit ? (
                                <PencilIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                    {canDelete && (
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
    ];
    // Si no tiene permiso para ver la lista, mostrar mensaje o redireccionar
    if (!canViewList) {
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
                    {canViewStats && !isStatsLoading && (
                        <p className="mt-1 text-sm text-gray-500">
                            Total de posts: {totalPosts}
                        </p>
                    )}
                </div>
            </Paper>

            <Paper contentClassName="space-y-4">
                {canCreate && (
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
                />
            </Paper>
            {/* Modal de creación/edición */}
            <PostModal
                isOpen={editModalState.isOpen}
                mode={editModalState.mode}
                onClose={() =>
                    dispatch(setEditModalState({ isOpen: false, mode: null }))
                }
            />

            {/* Modal de confirmación de eliminación */}
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
