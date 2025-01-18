import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ReusableModal from '@components/common/ReusableModal';
import PostForm from './PostForm';
import {
    selectSelectedPost,
    selectPostsLoading
} from '@store/admin/selectors/postsSelectors';
import {
    createPost,
    updatePost
} from '@store/admin/thunks/postsThunks';
import {
    setSelectedPost
} from '@store/admin/slices/postsSlice';

export default function PostModal({ isOpen, mode, onClose, onSuccess, readOnly = false }) {
    const dispatch = useDispatch();
    const selectedPost = useSelector(selectSelectedPost);
    const isLoading = useSelector(selectPostsLoading);

    const handleClose = () => {
        dispatch(setSelectedPost(null));
        onClose();
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
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={handleClose}
            title={mode === 'view'
                ? 'Ver Post'
                : mode === 'edit'
                    ? 'Editar Post'
                    : 'Crear Nuevo Post'}
            size="4xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <PostForm
                    post={selectedPost}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isLoading}
                    readOnly={readOnly || mode === 'view'}
                />
            </div>
        </ReusableModal>
    );
}