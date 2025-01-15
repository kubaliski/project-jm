// resources/js/features/contacts/components/ContactModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ReusableModal from '@components/common/ReusableModal';
import ContactForm from './ContactForm';
import { adminContactsService } from '@services/api';

export default function ContactModal({
    isOpen,
    onClose,
    contact = null,
    onSuccess
}) {
    const handleSubmit = async (formData) => {
        try {
            if (contact) {
                await adminContactsService.update(contact.id, formData);
            } else {
                await adminContactsService.create(formData);
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
            title={contact ? 'Editar Contacto' : 'Nuevo Contacto'}
            size="2xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <ContactForm
                    contact={contact}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </div>
        </ReusableModal>
    );
}

ContactModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    contact: PropTypes.object,
    onSuccess: PropTypes.func
};