import React, { useState } from 'react';
import { publicContactsService } from '@services/api';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (formData.full_name.trim().length < 2) {
            newErrors.full_name = 'El nombre debe tener al menos 2 caracteres';
        } else if (formData.full_name.trim().length > 255) {
            newErrors.full_name = 'El nombre no puede exceder los 255 caracteres';
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
        e.preventDefault();
        setSubmitStatus(null);

        if (!validateForm()) {
            // Anunciar errores para lectores de pantalla
            const firstError = Object.values(errors)[0];
            if (firstError) {
                announceError(firstError);
            }
            return;
        }

        setIsSubmitting(true);

        try {
            await publicContactsService.create(formData);
            setSubmitStatus('success');
            announceSuccess('Mensaje enviado correctamente');
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setSubmitStatus('error');
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                announceError('Ha ocurrido un error al enviar el formulario');
            }
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

    // Función para anunciar mensajes a lectores de pantalla
    const announceMessage = (message, type = 'polite') => {
        const announcement = document.getElementById('announcement');
        if (announcement) {
            announcement.textContent = message;
        }
    };

    const announceError = (message) => announceMessage(message, 'assertive');
    const announceSuccess = (message) => announceMessage(message, 'polite');

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Región para anuncios de lectores de pantalla */}
            <div
                id="announcement"
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            ></div>

            <h2
                id="contact-form-title"
                className="text-3xl font-bold text-center mb-8"
            >
                Contacta con nosotros
            </h2>

            {submitStatus === 'success' && (
                <div
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                    role="alert"
                    aria-labelledby="success-message"
                >
                    <p
                        id="success-message"
                        className="text-green-800 text-center"
                    >
                        ¡Gracias por tu mensaje! Nos pondremos en contacto contigo lo antes posible.
                    </p>
                </div>
            )}

            {submitStatus === 'error' && !Object.keys(errors).length && (
                <div
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    role="alert"
                    aria-labelledby="error-message"
                >
                    <p
                        id="error-message"
                        className="text-red-800 text-center"
                    >
                        Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.
                    </p>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
                aria-labelledby="contact-form-title"
                noValidate
            >
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    role="group"
                    aria-label="Información de contacto"
                >
                    <div>
                        <label
                            htmlFor="full_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nombre completo <span aria-label="requerido">*</span>
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg text-sm
                                ${errors.full_name
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                            `}
                            required
                            aria-required="true"
                            aria-invalid={errors.full_name ? 'true' : 'false'}
                            aria-describedby={errors.full_name ? 'full_name-error' : undefined}
                        />
                        {errors.full_name && (
                            <p
                                id="full_name-error"
                                className="mt-1 text-sm text-red-600"
                                role="alert"
                            >
                                {errors.full_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Correo electrónico <span aria-label="requerido">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg text-sm
                                ${errors.email
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                            `}
                            required
                            aria-required="true"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                            <p
                                id="email-error"
                                className="mt-1 text-sm text-red-600"
                                role="alert"
                            >
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Teléfono <span className="text-gray-500">(opcional)</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg text-sm
                            ${errors.phone
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                        `}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                        <p
                            id="phone-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                        >
                            {errors.phone}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Asunto <span aria-label="requerido">*</span>
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg text-sm
                            ${errors.subject
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                        `}
                        required
                        aria-required="true"
                        aria-invalid={errors.subject ? 'true' : 'false'}
                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                    />
                    {errors.subject && (
                        <p
                            id="subject-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                        >
                            {errors.subject}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Mensaje <span aria-label="requerido">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        className={`w-full px-4 py-2 border rounded-lg text-sm
                            ${errors.message
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
                        `}
                        required
                        aria-required="true"
                        aria-invalid={errors.message ? 'true' : 'false'}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && (
                        <p
                            id="message-error"
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                        >
                            {errors.message}
                        </p>
                    )}
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium
                            hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center" role="status">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <span>Enviando...</span>
                                <span className="sr-only">Por favor, espera mientras se envía el formulario</span>
                            </span>
                        ) : (
                            'Enviar mensaje'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;