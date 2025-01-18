import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import ReusableModal from "@components/common/ReusableModal";
import ContactForm from "./ContactForm";
import {
    selectSelectedContact,
    selectContactsLoading,
} from "@store/admin/selectors/contactsSelectors";
import {
    createContact,
    updateContact,
} from "@store/admin/thunks/contactsThunks";
import {
    setEditModalState,
    setSelectedContact,
} from "@store/admin/slices/contactsSlice";

export default function ContactModal({
    isOpen,
    mode,
    onClose,
    onSuccess,
    readOnly = false,
}) {
    const dispatch = useDispatch();
    const selectedContact = useSelector(selectSelectedContact);
    const isLoading = useSelector(selectContactsLoading);

    const handleClose = () => {
        onClose();
        dispatch(setSelectedContact(null));
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === "edit" && selectedContact) {
                await dispatch(
                    updateContact({
                        id: selectedContact.id,
                        formData,
                    })
                ).unwrap();
            } else {
                await dispatch(createContact(formData)).unwrap();
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
            title={
                mode === "view"
                    ? "Ver Contacto"
                    : mode === "edit"
                    ? "Editar Contacto"
                    : "Nuevo Contacto"
            }
            size="2xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <ContactForm
                    contact={selectedContact}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isLoading}
                    readOnly={readOnly || mode === "view"}
                />
            </div>
        </ReusableModal>
    );
}

ContactModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(["create", "edit", "view"]),
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    readOnly: PropTypes.bool,
};
