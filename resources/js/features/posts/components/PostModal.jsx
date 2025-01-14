import React from 'react';
import ReusableModal from '@components/common/ReusableModal';
import PostForm from './PostForm';
import { useAuth } from '@context/AuthContext';
import { adminPostsService } from '@services/api';

export default function PostModal({
    isOpen,
    onClose,
    post = null,
    onSuccess
}) {
    const { user } = useAuth();

    const handleSubmit = async (formData) => {
        try {
            if (post) {
                formData.append('_method', 'PUT');
                await adminPostsService.update(post.id, formData);
            } else {
                await adminPostsService.create(formData);
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title={post ? 'Editar Post' : 'Crear Nuevo Post'}
            size="4xl" // Cambiamos de 2xl a 4xl para más espacio
        >
            <div className="max-h-[80vh] overflow-y-auto"> {/* Añadimos scroll vertical si el contenido es muy largo */}
                <PostForm
                    post={post}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </div>
        </ReusableModal>
    );
}