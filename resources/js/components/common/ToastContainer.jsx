import React from 'react';
import PropTypes from 'prop-types';
import Toast from './Toast';
import { TOAST_CLASSES } from '@config/toast';

const ToastContainer = ({ toasts, onClose }) => {
    return (
        <div className={TOAST_CLASSES.container}>
            <div className={TOAST_CLASSES.innerContainer}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => onClose(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};

ToastContainer.propTypes = {
    toasts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['success', 'error', 'warning', 'info'])
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired
};

export default ToastContainer;