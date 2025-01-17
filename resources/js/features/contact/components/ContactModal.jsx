import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableModal from '@components/common/ReusableModal';
import ContactForm from './ContactForm';
import {
    selectSelectedContact,
    selectEditModalState,
    selectContactsLoading
} from '@store/admin/selectors/contactsSelectors';
import {
    createContact,
    updateContact
} from '@store/admin/thunks/contactsThunks';
import {
    setEditModalState,
    setSelectedContact
} from '@store/admin/slices/contactsSlice';

export default function ContactModal() {
    const dispatch = useDispatch();
    const selectedContact = useSelector(selectSelectedContact);
    const { isOpen, mode } = useSelector(selectEditModalState);
    const isLoading = useSelector(selectContactsLoading);

    const handleClose = () => {
        dispatch(setEditModalState({ isOpen: false, mode: null }));
        dispatch(setSelectedContact(null));
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === 'edit' && selectedContact) {
                await dispatch(updateContact({
                    id: selectedContact.id,
                    formData
                })).unwrap();
            } else {
                await dispatch(createContact(formData)).unwrap();
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
            title={mode === 'edit' ? 'Editar Contacto' : 'Nuevo Contacto'}
            size="2xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <ContactForm
                    contact={selectedContact}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isLoading}
                />
            </div>
        </ReusableModal>
    );
}