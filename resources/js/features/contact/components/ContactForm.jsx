// resources/js/features/contacts/components/ContactForm.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function ContactForm({ contact = null, onSubmit, onCancel }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        status: 'pending',
        observations: ''
    });

    useEffect(() => {
        if (contact) {
            setFormData({
                full_name: contact.full_name,
                email: contact.email,
                phone: contact.phone || '',
                subject: contact.subject,
                message: contact.message,
                status: contact.status,
                observations: contact.observations || ''
            });
        }
    }, [contact]);

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
        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit(formData);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Ocurrió un error al guardar el contacto.'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.general}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Nombre completo */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.full_name
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                    />
                    {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.email
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Teléfono */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.phone
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }`}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                {/* Estado */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Estado
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En tramitación</option>
                        <option value="completed">Finalizado</option>
                        <option value="spam">Spam</option>
                    </select>
                </div>
            </div>

            {/* Asunto */}
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Asunto
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                        ${errors.subject
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                />
                {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
            </div>

            {/* Mensaje */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Mensaje
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                        ${errors.message
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                />
                {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
            </div>

            {/* Observaciones */}
            <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
                    Observaciones internas
                </label>
                <textarea
                    id="observations"
                    name="observations"
                    rows="3"
                    value={formData.observations}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Añade notas o comentarios internos sobre este contacto..."
                />
                {errors.observations && (
                    <p className="mt-1 text-sm text-red-600">{errors.observations}</p>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Guardando...
                        </span>
                    ) : (
                        contact ? 'Actualizar' : 'Crear'
                    )}
                </button>
            </div>
        </form>
    );
}

ContactForm.propTypes = {
    contact: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};