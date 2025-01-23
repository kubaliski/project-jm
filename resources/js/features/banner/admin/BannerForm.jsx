import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { SubmitButton, FormInput } from "@components/common";
import { selectBannersError } from "@store/admin/selectors/bannersSelectors";
import {  BANNER_CLASSES,
    MARQUEE_CLASSES,
    getClassValue,
    getClassPreview,
    getGradientStyle,
    getGlassStyle,
    combineClasses
 } from "../bannerCustomClasses";
import {
    formatDateOnlyForInput,
    formatDateForServer,
    isValidDateFormat
} from "@utils/dateUtils";

const MarqueePreview = ({ text }) => (
    <div className={MARQUEE_CLASSES.content}>
        <span className="inline-block mx-16 whitespace-nowrap">{text}</span>
        <span className="inline-block mx-16 whitespace-nowrap">{text}</span>
        <span className="inline-block mx-16 whitespace-nowrap">{text}</span>
    </div>
);

export default function BannerForm({
    banner = null,
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
}) {
    const serverErrors = useSelector(selectBannersError);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        text: "",
        background_color: "#000000",
        text_color: "#FFFFFF",
        start_date: "",
        end_date: "",
        is_active: false,
        priority: 0,
        custom_class: "default"
    });

    // Efectos
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    useEffect(() => {
        if (banner) {
            setFormData({
                text: banner.text || "",
                background_color: banner.background_color || "#000000",
                text_color: banner.text_color || "#FFFFFF",
                start_date: banner.start_date ? formatDateOnlyForInput(banner.start_date) : "",
                end_date: banner.end_date ? formatDateOnlyForInput(banner.end_date) : "",
                is_active: banner.is_active || false,
                priority: banner.priority || 0,
                custom_class: banner.custom_class || "default"
            });
        }
        setErrors({});
    }, [banner]);


    // Handlers
    const handleChange = (e) => {
        if (readOnly) return;

        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.text.trim()) {
            validationErrors.text = "El texto es requerido";
        }
        if (!formData.background_color) {
            validationErrors.background_color = "El color de fondo es requerido";
        }
        if (!formData.text_color) {
            validationErrors.text_color = "El color del texto es requerido";
        }

        // Validar formato de fechas
        if (formData.start_date && !isValidDateFormat(formData.start_date)) {
            validationErrors.start_date = "Formato de fecha inválido";
        }
        if (formData.end_date && !isValidDateFormat(formData.end_date)) {
            validationErrors.end_date = "Formato de fecha inválido";
        }

        // Validar que la fecha de fin sea posterior a la de inicio
        if (formData.start_date && formData.end_date) {
            const start = new Date(formData.start_date);
            const end = new Date(formData.end_date);
            if (end < start) {
                validationErrors.end_date = "La fecha de fin debe ser posterior a la fecha de inicio";
            }
        }

        return validationErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Preparar datos para el servidor
            const dataForServer = {
                ...formData,
                start_date: formData.start_date ? formatDateForServer(formData.start_date) : null,
                end_date: formData.end_date ? formatDateForServer(formData.end_date) : null
            };
            await onSubmit(dataForServer);
        } catch (error) {
            console.error("Error al guardar el banner:", error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: "Ocurrió un error al guardar el banner."
                });
            }
        }
    };

    const isMarquee = formData.custom_class === 'marquee';
    const isGradient = formData.custom_class === 'gradient';
    const isGlass = formData.custom_class === 'glass';
    const basePreviewClasses = 'w-full p-4 text-center transition-all duration-200';
    const customClasses = getClassValue(formData.custom_class);

    const backgroundStyle = isGradient
    ? getGradientStyle(formData.background_color)
    : isGlass
        ? getGlassStyle(formData.background_color)
        : { backgroundColor: formData.background_color };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error General */}
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

             {/* Preview */}
             <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vista previa
                </label>
                <div
                    className={combineClasses(basePreviewClasses, customClasses)}
                    style={{
                        ...backgroundStyle,
                        color: formData.text_color
                    }}
                >
                    {isMarquee ? (
                        <div className={combineClasses(
                            MARQUEE_CLASSES.container,
                            'px-8'
                        )}>
                            <MarqueePreview text={formData.text || "Vista previa del banner"} />
                        </div>
                    ) : (
                        <span>{formData.text || "Vista previa del banner"}</span>
                    )}
                </div>
            </div>
            {/* Contenido */}
            <div className="space-y-4">
                {/* Texto del banner */}
                <FormInput
                    id="text"
                    name="text"
                    label="Texto del banner"
                    value={formData.text}
                    onChange={handleChange}
                    error={errors.text}
                    required
                    readOnly={readOnly}
                />

                {/* Selector de clase personalizada */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Estilo personalizado
                    </label>
                    <select
                        name="custom_class"
                        value={formData.custom_class}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={readOnly}
                    >
                        {Object.entries(BANNER_CLASSES).map(([key, { label }]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {/* Descripción del estilo seleccionado */}
                    {formData.custom_class && formData.custom_class !== 'default' && (
                        <p className="text-sm text-gray-500 mt-1">
                            {getClassPreview(formData.custom_class)}
                        </p>
                    )}
                </div>

                {/* Colores */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color de fondo
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                name="background_color"
                                value={formData.background_color}
                                onChange={handleChange}
                                className="h-10 w-20"
                                readOnly={readOnly}
                            />
                            <input
                                type="text"
                                name="background_color"
                                value={formData.background_color}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly={readOnly}
                            />
                        </div>
                        {errors.background_color && (
                            <p className="mt-1 text-sm text-red-600">{errors.background_color}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color del texto
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                name="text_color"
                                value={formData.text_color}
                                onChange={handleChange}
                                className="h-10 w-20"
                                readOnly={readOnly}
                            />
                            <input
                                type="text"
                                name="text_color"
                                value={formData.text_color}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly={readOnly}
                            />
                        </div>
                        {errors.text_color && (
                            <p className="mt-1 text-sm text-red-600">{errors.text_color}</p>
                        )}
                    </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        type="date"
                        id="start_date"
                        name="start_date"
                        label="Fecha de inicio"
                        value={formData.start_date}
                        onChange={handleChange}
                        error={errors.start_date}
                        readOnly={readOnly}
                    />

                    <FormInput
                        type="date"
                        id="end_date"
                        name="end_date"
                        label="Fecha de fin"
                        value={formData.end_date}
                        onChange={handleChange}
                        error={errors.end_date}
                        readOnly={readOnly}
                    />
                </div>

                {/* Estado */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        disabled={readOnly}
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        Banner activo
                    </label>
                </div>

                {/* Prioridad */}
                <FormInput
                    type="number"
                    id="priority"
                    name="priority"
                    label="Prioridad"
                    value={formData.priority}
                    onChange={handleChange}
                    error={errors.priority}
                    readOnly={readOnly}
                    min="0"
                    helperText="Un número mayor indica mayor prioridad"
                />
            </div>

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
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <SubmitButton
                            isSubmitting={isSubmitting}
                            isUpdate={!!banner}
                            submitText="Crear banner"
                            updateText="Actualizar banner"
                            loadingText="Guardando banner..."
                        />
                    </>
                )}
            </div>
        </form>
    );
}

BannerForm.propTypes = {
    banner: PropTypes.shape({
        id: PropTypes.number,
        text: PropTypes.string,
        background_color: PropTypes.string,
        text_color: PropTypes.string,
        start_date: PropTypes.string,
        end_date: PropTypes.string,
        is_active: PropTypes.bool,
        priority: PropTypes.number,
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
};