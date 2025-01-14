import React from 'react';
import ReusableModal from '../../../components/common/ReusableModal';
import PostForm from './PostForm';
import { useAuth } from '../../../context/AuthContext';

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
            // Actualizar post existente
            formData.append('_method', 'PUT'); // Añadir el método PUT
            // Usamos POST porque FormData no soporta PUT directamente
            await window.axios.post(`/api/posts/${post.id}`, formData);
        } else {
            // Crear nuevo post
            await window.axios.post('/api/posts', formData);
        }

        onSuccess?.();
        onClose();
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagamos el error para que PostForm pueda manejarlo
    }
};

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title={post ? 'Editar Post' : 'Crear Nuevo Post'}
            size="2xl"
        >
            <PostForm
                post={post}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </ReusableModal>
    );
}