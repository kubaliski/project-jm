import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { selectAdminAppInfoError } from "@store/admin/selectors/appInfoSelectors";
import { SubmitButton, FormInput } from "@/components/common";

export default function AppInfoForm({
    initialData = null,
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
}) {
    const serverErrors = useSelector(selectAdminAppInfoError);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        company_name:"",
        legal_representative: "",
        address: "",
        contact_email: "",
        phone_1: "",
        phone_2: "",
    });

    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                company_name: initialData.company_name || "",
                legal_representative: initialData.legal_representative || "",
                address: initialData.address || "",
                contact_email: initialData.contact_email || "",
                phone_1: initialData.phone_1 || "",
                phone_2: initialData.phone_2 || "",
            });
        }
        setErrors({});
    }, [initialData]);

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

        const validationErrors = {};
        if (!formData.company_name.trim()) {
            validationErrors.company_name = "El nombre de la empresa es requerido";
        }
        if (!formData.legal_representative.trim()) {
            validationErrors.legal_representative = "El representante legal es requerido";
        }
        if (!formData.contact_email.trim()) {
            validationErrors.contact_email = "El email de contacto es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
            validationErrors.contact_email = "El email no es válido";
        }
        if (!formData.address.trim()) {
            validationErrors.address = "La dirección es requerida";
        }
        if (!formData.phone_1.trim()) {
            validationErrors.phone_1 = "El teléfono principal es requerido";
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
                    general: "Ocurrió un error al guardar la información.",
                });
            }
        }
    };

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
                            <p className="text-sm text-red-700">{errors.general}</p>
                        </div>
                    </div>
                </div>
            )}
            <FormInput
                id="company_name"
                name="company_name"
                label="Nombre de la Empresa"
                value={formData.company_name}
                onChange={handleChange}
                error={errors.company_name}
                required
                readOnly={readOnly}
                disabled={readOnly}
            />
            <FormInput
                id="legal_representative"
                name="legal_representative"
                label="Representante Legal"
                value={formData.legal_representative}
                onChange={handleChange}
                error={errors.legal_representative}
                required
                readOnly={readOnly}
                disabled={readOnly}
            />

            <FormInput
                id="address"
                name="address"
                label="Dirección"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                required
                readOnly={readOnly}
                disabled={readOnly}
            />

            <FormInput
                id="contact_email"
                name="contact_email"
                type="email"
                label="Email de Contacto"
                value={formData.contact_email}
                onChange={handleChange}
                error={errors.contact_email}
                required
                readOnly={readOnly}
                disabled={readOnly}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    id="phone_1"
                    name="phone_1"
                    label="Teléfono Principal"
                    value={formData.phone_1}
                    onChange={handleChange}
                    error={errors.phone_1}
                    required
                    readOnly={readOnly}
                    disabled={readOnly}
                />

                <FormInput
                    id="phone_2"
                    name="phone_2"
                    label="Teléfono Secundario"
                    value={formData.phone_2}
                    onChange={handleChange}
                    error={errors.phone_2}
                    readOnly={readOnly}
                    disabled={readOnly}
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                {!readOnly && (
                    <>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </button>
                        )}
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            isUpdate={!!initialData}
                        />
                    </>
                )}
            </div>
        </form>
    );
}

AppInfoForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
};