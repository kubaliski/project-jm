import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { selectContactsError } from "@store/admin/selectors/contactsSelectors";
import { SubmitButton, FormInput, FormSelect } from "@/components/common";

export default function ContactForm({
    contact = null,
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
}) {
    const serverErrors = useSelector(selectContactsError);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        status: "pending",
        observations: "",
    });

    // Efecto para manejar errores del servidor
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    // Efecto para inicializar el formulario con los datos del contacto
    useEffect(() => {
        if (contact) {
            setFormData({
                full_name: contact.full_name || "",
                email: contact.email || "",
                phone: contact.phone || "",
                subject: contact.subject || "",
                message: contact.message || "",
                status: contact.status || "pending",
                observations: contact.observations || "",
            });
        }
        setErrors({});
    }, [contact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        const validationErrors = {};
        if (!formData.full_name.trim()) {
            validationErrors.full_name = "El nombre es requerido";
        }
        if (!formData.email.trim()) {
            validationErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = "El email no es válido";
        }
        if (!formData.subject.trim()) {
            validationErrors.subject = "El asunto es requerido";
        }
        if (!formData.message.trim()) {
            validationErrors.message = "El mensaje es requerido";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: "Ocurrió un error al guardar el contacto.",
                });
            }
        }
    };

    const statusOptions = [
        { value: "pending", label: "Pendiente" },
        { value: "in_progress", label: "En tramitación" },
        { value: "completed", label: "Finalizado" },
        { value: "spam", label: "Spam" },
    ];

    return (
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

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <FormInput
                    id="full_name"
                    name="full_name"
                    label="Nombre completo"
                    value={formData.full_name}
                    onChange={handleChange}
                    error={errors.full_name}
                    required
                    readOnly={readOnly}
                    disabled={readOnly}
                />

                <FormInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    readOnly={readOnly}
                    disabled={readOnly}
                />

                <FormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    readOnly={readOnly}
                    disabled={readOnly}
                />

                <FormSelect
                    id="status"
                    name="status"
                    label="Estado"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                    disabled={readOnly}
                    readOnly={readOnly}
                />
            </div>

            <FormInput
                id="subject"
                name="subject"
                label="Asunto"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
                required
                readOnly={readOnly}
                disabled={readOnly}
            />

            <FormInput
                id="message"
                name="message"
                type="textarea"
                label="Mensaje"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                required
                readOnly={readOnly}
                disabled={readOnly}
                rows={4}
            />

            <FormInput
                id="observations"
                name="observations"
                type="textarea"
                label="Observaciones internas"
                value={formData.observations}
                onChange={handleChange}
                error={errors.observations}
                readOnly={readOnly}
                disabled={readOnly}
                placeholder="Añade notas o comentarios internos sobre este contacto..."
                rows={3}
            />

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4">
                {readOnly ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cerrar
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            isUpdate={!!contact}
                        />
                    </>
                )}
            </div>
        </form>
    );
}

ContactForm.propTypes = {
    contact: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
};
