import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Table, TableFilters, ConfirmationDialog } from '@components/common';
import PostModal from '@features/posts/components/PostModal';
import { formatDateForDisplay, isFutureDate } from '@utils/dateUtils';
import { postsTableConfig } from '@config/tables/postsTable';
import {
    selectPaginatedPosts,
    selectPostsLoading,
    selectFilteredAndSortedPosts,
    selectPostsFilters,
    selectPostsSortConfig,
    selectPostsPagination,
    selectEditModalState,
    selectDeleteModalState,
    selectSelectedPost
} from '@store/admin/selectors/postsSelectors';
import {
    fetchPosts,
    deletePost
} from '@store/admin/thunks/postsThunks';
import {
    setFilters,
    setSortConfig,
    setCurrentPage,
    setSelectedPost,
    setEditModalState,
    setDeleteModalState,
} from '@store/admin/slices/postsSlice';
import { useAuth } from '@hooks';


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

    // Permisos
    const canEdit = permissions.includes('post.edit');
    const canDelete = permissions.includes('post.delete');
    const canCreate = permissions.includes('post.create');

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleCreateClick = () => {
        dispatch(setSelectedPost(null));
        dispatch(setEditModalState({ isOpen: true, mode: 'create' }));
    };

    const handleEditClick = (post) => {
        dispatch(setSelectedPost(post));
        dispatch(setEditModalState({ isOpen: true, mode: 'edit' }));
    };

    const handleDeleteClick = (post) => {
        dispatch(setSelectedPost(post));
        dispatch(setDeleteModalState({ isOpen: true}));
    };

    const handleConfirmDelete = async () => {
        if (!selectedPost) return;

        try {
            await dispatch(deletePost(selectedPost.id)).unwrap();
            dispatch(setDeleteModalState({ isOpen: false}));
            dispatch(setSelectedPost(null));
        } catch (error) {
            console.error('Error al eliminar el post:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        console.log('Applying filter:', key, value);
        dispatch(setFilters({
            ...filters,
            [key]: value
        }));
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
            key: 'title',
            header: 'Título',
            render: (post) => (
                <>
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    {post.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                            {post.excerpt}
                        </div>
                    )}
                </>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            render: (post) => getStatusBadge(post)
        },
        {
            key: 'created_at',
            header: 'Fecha de creación',
            render: (post) => (
                <span className="text-sm text-gray-500">
                    {formatDateForDisplay(post.created_at)}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Acciones',
            className: 'text-right',
            cellClassName: 'text-right',
            render: (post) => (
                <>
                    {canEdit && (
                        <button
                            onClick={() => handleEditClick(post)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Editar"
                        >
                            <PencilIcon className="h-5 w-5" />
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
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Listado de posts y artículos
                    </p>
                </div>
                {canCreate && (
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={handleCreateClick}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Crear Post
                        </button>
                    </div>
                )}
            </div>

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

            {/* Modal de creación/edición */}
            <PostModal
                isOpen={editModalState.isOpen}
                mode={editModalState.mode}
                onClose={() => dispatch(setEditModalState({ isOpen: false, mode: null }))}
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