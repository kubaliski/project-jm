import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableModal from '@components/common/ReusableModal';
import PostForm from './PostForm';
import {
    selectSelectedPost,
    selectEditModalState,
    selectPostsLoading
} from '@store/admin/selectors/postsSelectors';
import {
    createPost,
    updatePost
} from '@store/admin/thunks/postsThunks';
import {
    setEditModalState,
    setSelectedPost
} from '@store/admin/slices/postsSlice';

export default function PostModal() {
    const dispatch = useDispatch();
    const selectedPost = useSelector(selectSelectedPost);
    const { isOpen, mode } = useSelector(selectEditModalState);
    const isLoading = useSelector(selectPostsLoading);

    const handleClose = () => {
        dispatch(setEditModalState({ isOpen: false, mode: null }));
        dispatch(setSelectedPost(null));
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === 'edit' && selectedPost) {
                await dispatch(updatePost({
                    id: selectedPost.id,
                    formData
                })).unwrap();
            } else {
                await dispatch(createPost(formData)).unwrap();
            }
            handleClose();
        } catch (error) {
            throw error;
        }
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={handleClose}
            title={mode === 'edit' ? 'Editar Post' : 'Crear Nuevo Post'}
            size="4xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <PostForm
                    post={selectedPost}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isLoading}
                />
            </div>
        </ReusableModal>
    );
}