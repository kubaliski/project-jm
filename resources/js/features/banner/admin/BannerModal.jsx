import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import ReusableModal from "@components/common/ReusableModal";
import BannerForm from "./BannerForm";
import {
    selectSelectedBanner,
    selectBannersLoading,
} from "@store/admin/selectors/bannersSelectors";
import { createBanner, updateBanner } from "@store/admin/thunks/bannersThunks";
import { setSelectedBanner } from "@store/admin/slices/bannersSlice";

export default function BannerModal({
    isOpen,
    mode,
    onClose,
    onSuccess,
    readOnly = false,
}) {
    const dispatch = useDispatch();
    const selectedBanner = useSelector(selectSelectedBanner);
    const isLoading = useSelector(selectBannersLoading);

    const handleClose = () => {
        dispatch(setSelectedBanner(null));
        onClose();
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === "edit" && selectedBanner) {
                await dispatch(
                    updateBanner({
                        id: selectedBanner.id,
                        data: formData
                    })
                ).unwrap();
            } else {
                await dispatch(createBanner(formData)).unwrap();
            }
            handleClose();
            if (onSuccess) {
                onSuccess(mode);
            }
        } catch (error) {
            console.error('Error en la operación del banner:', error);
            throw error; // Propagamos el error para que lo maneje el formulario
        }
    };

    let modalTitle;
    switch (mode) {
        case 'view':
            modalTitle = 'Ver Banner';
            break;
        case 'edit':
            modalTitle = 'Editar Banner';
            break;
        default:
            modalTitle = 'Crear Nuevo Banner';
    }

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={handleClose}
            title={modalTitle}
            size="2xl"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                <BannerForm
                    banner={selectedBanner}
                    onSubmit={handleSubmit}
                    onCancel={handleClose}
                    isSubmitting={isLoading}
                    readOnly={readOnly || mode === "view"}
                />
            </div>
        </ReusableModal>
    );
}

BannerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(["view", "edit", "create"]),
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    readOnly: PropTypes.bool,
};