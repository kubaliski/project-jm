import React from 'react';
import PropTypes from 'prop-types';
import ReusableModal from './ReusableModal';

export default function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title = '¿Estás seguro?',
    message = '¿Estás seguro de que quieres realizar esta acción?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmButtonStyle = 'danger' // 'danger' | 'primary'
}) {
    const buttonStyles = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="space-y-6">
                <p className="text-sm text-gray-500">
                    {message}
                </p>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonStyles[confirmButtonStyle]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </ReusableModal>
    );
}

ConfirmationDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    confirmButtonStyle: PropTypes.oneOf(['danger', 'primary'])
};