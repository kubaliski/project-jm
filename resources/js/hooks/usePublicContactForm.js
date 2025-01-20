// hooks/usePublicContactForm.js
import { useState } from 'react';
import { publicContactsService } from '@services/api';

const INITIAL_FORM_STATE = {
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
};

export const usePublicContactForm = (onSuccess) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (formData.full_name.trim().length < 2) {
            newErrors.full_name = 'El nombre debe tener al menos 2 caracteres';
        } else if (formData.full_name.trim().length > 50) {
            newErrors.full_name = 'El nombre no puede exceder los 50 caracteres';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Por favor, introduce un email válido';
        }

        if (formData.phone && !/^[0-9+\s()-]{6,20}$/.test(formData.phone)) {
            newErrors.phone = 'Por favor, introduce un número de teléfono válido';
        }

        if (formData.subject.trim().length < 3) {
            newErrors.subject = 'El asunto debe tener al menos 3 caracteres';
        } else if (formData.subject.trim().length > 255) {
            newErrors.subject = 'El asunto no puede exceder los 255 caracteres';
        }

        if (formData.message.trim().length < 10) {
            newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setSubmitStatus(null);

        if (!validateForm()) {
            return false;
        }

        setIsSubmitting(true);

        try {
            await publicContactsService.create(formData);
            setSubmitStatus('success');
            setFormData(INITIAL_FORM_STATE);
            if (onSuccess) {
                onSuccess();
            }
            return true;
        } catch (error) {
            setSubmitStatus('error');
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setSubmitStatus(null);
    };

    return {
        formData,
        errors,
        isSubmitting,
        submitStatus,
        handleChange,
        handleSubmit,
        resetForm
    };
};