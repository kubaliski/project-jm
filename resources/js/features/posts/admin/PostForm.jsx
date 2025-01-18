import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { formatDateForInput } from "@utils/dateUtils";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { RichTextEditor, SubmitButton, FormInput } from "@components/common";
import { selectPostsError } from "@store/admin/selectors/postsSelectors";
import {
    FeaturedImageSection,
    SEOSection,
    PublicationSection,
} from "./PostFormComponents";

export default function PostForm({
    post = null,
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false,
}) {
    const serverErrors = useSelector(selectPostsError);
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        featured_image: null,
        seo_title: "",
        seo_description: "",
        is_published: false,
        published_at: null,
        schedule_publication: false,
    });

    // Efectos
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || "",
                content: typeof post.content === "string" ? post.content : "",
                excerpt: post.excerpt || "",
                featured_image: post.featured_image || null,
                seo_title: post.seo_title || "",
                seo_description: post.seo_description || "",
                is_published: post.is_published || false,
                published_at: post.published_at
                    ? formatDateForInput(post.published_at)
                    : null,
                schedule_publication:
                    (post.published_at !== null && !post.is_published) || false,
            });
            setPreviewImage(post.featured_image || null);
        }
        setErrors({});
    }, [post]);

    // Handlers
    const handleChange = (e) => {
        if (readOnly) return;

        const { name, value, type, checked, files } = e.target;

        if (type === "file" && files?.[0]) {
            const file = files[0];
            if (!file.type.startsWith("image/")) {
                setErrors((prev) => ({
                    ...prev,
                    featured_image: "El archivo debe ser una imagen",
                }));
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    featured_image: "La imagen no debe superar los 10MB",
                }));
                return;
            }

            setFormData((prev) => ({
                ...prev,
                featured_image: file,
            }));
            setPreviewImage(URL.createObjectURL(file));
        } else if (type === "checkbox") {
            handlePublicationStateChange(name, checked);
        } else if (name === "content") {
            setFormData((prev) => ({
                ...prev,
                content: typeof value === "string" ? value : "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handlePublicationStateChange = (name, checked) => {
        if (name === "is_published") {
            setFormData((prev) => ({
                ...prev,
                is_published: checked,
                schedule_publication: false,
                published_at: checked
                    ? new Date().toISOString().slice(0, 16)
                    : null,
            }));
        } else if (name === "schedule_publication") {
            setFormData((prev) => ({
                ...prev,
                schedule_publication: checked,
                is_published: false,
                published_at: checked
                    ? new Date().toISOString().slice(0, 16)
                    : null,
            }));
        }
    };

    const removeImage = () => {
        if (readOnly) return;
        setFormData((prev) => ({ ...prev, featured_image: null }));
        setPreviewImage(null);
        if (document.getElementById("featured_image")) {
            document.getElementById("featured_image").value = "";
        }
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.title.trim()) {
            validationErrors.title = "El título es requerido";
        }
        if (!formData.content.trim()) {
            validationErrors.content = "El contenido es requerido";
        }
        if (formData.schedule_publication && !formData.published_at) {
            validationErrors.published_at =
                "La fecha de publicación es requerida";
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;

        setErrors({});

        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "featured_image") {
                    if (value instanceof File) {
                        formDataToSend.append(key, value);
                    }
                } else if (key !== "schedule_publication") {
                    if (value !== null && value !== undefined) {
                        formDataToSend.append(
                            key,
                            typeof value === "boolean"
                                ? value
                                    ? "1"
                                    : "0"
                                : value
                        );
                    }
                }
            });

            await onSubmit(formDataToSend);
        } catch (error) {
            console.error("Error al guardar el post:", error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: "Ocurrió un error al guardar el post.",
                });
            }
        }
    };

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
                            <p className="text-sm text-red-700">
                                {errors.general}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Campos Principales */}
            <div className="space-y-6">
                <FormInput
                    id="title"
                    name="title"
                    label="Título"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    required
                    readOnly={readOnly}
                    disabled={readOnly}
                />

                {/* Editor de Contenido */}
                <div>
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Contenido
                    </label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={(content) =>
                            !readOnly &&
                            setFormData((prev) => ({
                                ...prev,
                                content: content,
                            }))
                        }
                        error={errors.content}
                        readOnly={readOnly}
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.content}
                        </p>
                    )}
                </div>

                {/* Extracto */}
                <FormInput
                    id="excerpt"
                    name="excerpt"
                    type="textarea"
                    label="Extracto"
                    value={formData.excerpt}
                    onChange={handleChange}
                    error={errors.excerpt}
                    readOnly={readOnly}
                    disabled={readOnly}
                    rows={3}
                    placeholder="Escribe un breve resumen del artículo..."
                    helperText="El extracto se mostrará en la lista de artículos y en los resultados de búsqueda. Si lo dejas vacío, se generará automáticamente a partir del contenido."
                />

                {/* Imagen destacada */}
                <FeaturedImageSection
                    previewImage={previewImage}
                    handleChange={handleChange}
                    removeImage={removeImage}
                    readOnly={readOnly}
                    errors={errors}
                />
            </div>

            {/* SEO Section */}
            <SEOSection
                formData={formData}
                handleChange={handleChange}
                readOnly={readOnly}
            />

            {/* Publication Options */}
            <PublicationSection
                formData={formData}
                handleChange={handleChange}
                readOnly={readOnly}
                errors={errors}
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
                            isUpdate={!!post}
                            submitText="Crear post"
                            updateText="Actualizar post"
                            loadingText="Guardando post..."
                        />
                    </>
                )}
            </div>
        </form>
    );
}

PostForm.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        title: PropTypes.string,
        content: PropTypes.string,
        excerpt: PropTypes.string,
        featured_image: PropTypes.string,
        seo_title: PropTypes.string,
        seo_description: PropTypes.string,
        is_published: PropTypes.bool,
        published_at: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
};
