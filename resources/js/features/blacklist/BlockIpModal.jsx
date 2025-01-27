import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { XCircleIcon } from '@heroicons/react/24/solid';
import ReusableModal from '@components/common/ReusableModal';
import { FormInput, SubmitButton } from '@components/common';
import { blockIp } from '@store/admin/thunks/blacklistThunks';
import { selectBlacklistLoading } from '@store/admin/selectors/blacklistSelectors';

export default function BlockIpModal({ isOpen, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const isLoading = useSelector(selectBlacklistLoading);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ ip: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const validationErrors = {};
        if (!formData.ip.trim()) {
            validationErrors.ip = 'La dirección ip es requerida';
        } else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(formData.ip)) {
            validationErrors.ip = 'Formato de la dirección ip no válido';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await dispatch(blockIp(formData.ip)).unwrap();
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setErrors({
                general: error.message || 'Error bloqueando la dirección ip'
            });
        }
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Bloquea una dirección IP"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <XCircleIcon
                                    className="h-5 w-5 text-red-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {errors.general}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <FormInput
                    id="ip"
                    name="ip"
                    label="Dirección IP"
                    value={formData.ip}
                    onChange={handleChange}
                    error={errors.ip}
                    required
                    placeholder="Introduce una dirección IP (e.g., 192.168.1.1)"
                />

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <SubmitButton
                        isSubmitting={isLoading}
                        text="Bloquear IP"
                    />
                </div>
            </form>
        </ReusableModal>
    );
}

BlockIpModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};