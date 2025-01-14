import React, { useState, useEffect, useMemo } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Table from '../../../components/common/ReusableTable';
import TableFilters from '../../../components/common/ReusableTableFilters';
import PostModal from '../../../features/posts/components/PostModal';
import ConfirmationDialog from '../../../components/common/ConfirmationDialog';
import { formatDateForDisplay, isFutureDate } from '../../../utils/dateUtils';
import { postsTableConfig } from '../../../config/tables/postsTable';
import { useTableFilters } from '../../../hooks/useTableFilters';
import { adminPostsService } from '../../../services/api';

export default function PostsList() {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const itemsPerPage = 10;

    const {
        filteredData: filteredPosts,
        filters,
        sortConfig,
        currentPage,
        setCurrentPage,
        handleFilterChange,
        handleSortChange
    } = useTableFilters(posts, postsTableConfig);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await adminPostsService.getAll();
            setPosts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar los posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreateClick = () => {
        setSelectedPost(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;

        try {
            await adminPostsService.delete(postToDelete.id);
            await fetchPosts();
            setIsDeleteDialogOpen(false);
            setPostToDelete(null);
        } catch (error) {
            console.error('Error al eliminar el post:', error);
        }
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
                    <button
                        onClick={() => handleEditClick(post)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Editar"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleDeleteClick(post)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </>
            )
        }
    ];

    // Calcular posts paginados
    const paginatedPosts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredPosts.slice(start, start + itemsPerPage);
    }, [filteredPosts, currentPage]);

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Listado de posts y artículos
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={handleCreateClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Crear Post
                    </button>
                </div>
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
                onPageChange={setCurrentPage}
                emptyMessage="No hay posts creados"
            />

            <PostModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPost(null);
                }}
                post={selectedPost}
                onSuccess={fetchPosts}
            />

            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setPostToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar el post "${postToDelete?.title}"?`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmButtonStyle="danger"
            />
        </div>
    );
}