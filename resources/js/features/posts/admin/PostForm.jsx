import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '@utils/dateUtils';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { RichTextEditor, SubmitButton} from '@components/common';
import { selectPostsError } from '@store/admin/selectors/postsSelectors';

// Componente de botón de submit reutilizable


export default function PostForm({
    post = null,
    onSubmit,
    onCancel,
    isSubmitting = false,
    readOnly = false
}) {
    const serverErrors = useSelector(selectPostsError);
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        featured_image: null,
        seo_title: '',
        seo_description: '',
        is_published: false,
        published_at: null,
        schedule_publication: false
    });

    // Efecto para manejar errores del servidor
    useEffect(() => {
        if (serverErrors?.errors) {
            setErrors(serverErrors.errors);
        }
    }, [serverErrors]);

    // Efecto para inicializar el formulario con los datos del post
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                content: typeof post.content === 'string' ? post.content : '',
                excerpt: post.excerpt || '',
                featured_image: post.featured_image || null,
                seo_title: post.seo_title || '',
                seo_description: post.seo_description || '',
                is_published: post.is_published || false,
                published_at: post.published_at ? formatDateForInput(post.published_at) : null,
                schedule_publication: post.published_at !== null && !post.is_published || false
            });
            setPreviewImage(post.featured_image || null);
        }
        setErrors({});
    }, [post]);
    // Manejador de cambios en los campos del formulario
    const handleChange = (e) => {
        if (readOnly) return;

        const { name, value, type, checked, files } = e.target;

        // Manejo de archivos
        if (type === 'file' && files?.[0]) {
            const file = files[0];
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    featured_image: 'El archivo debe ser una imagen'
                }));
                return;
            }
            // Validar tamaño (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    featured_image: 'La imagen no debe superar los 10MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                featured_image: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
        // Manejo de checkboxes
        else if (type === 'checkbox') {
            handlePublicationStateChange(name, checked);
        }
        // Manejo del editor de contenido
        else if (name === 'content') {
            setFormData(prev => ({
                ...prev,
                content: typeof value === 'string' ? value : ''
            }));
        }
        // Manejo de otros campos
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Limpiar error del campo modificado
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Manejador específico para estados de publicación
    const handlePublicationStateChange = (name, checked) => {
        if (name === 'is_published') {
            setFormData(prev => ({
                ...prev,
                is_published: checked,
                schedule_publication: false,
                published_at: checked ? new Date().toISOString().slice(0, 16) : null
            }));
        } else if (name === 'schedule_publication') {
            setFormData(prev => ({
                ...prev,
                schedule_publication: checked,
                is_published: false,
                published_at: checked ? new Date().toISOString().slice(0, 16) : null
            }));
        }
    };

    // Manejador para remover imagen
    const removeImage = () => {
        if (readOnly) return;

        setFormData(prev => ({ ...prev, featured_image: null }));
        setPreviewImage(null);
        if (document.getElementById('featured_image')) {
            document.getElementById('featured_image').value = '';
        }
    };

    // Validación del formulario
    const validateForm = () => {
        const validationErrors = {};

        if (!formData.title.trim()) {
            validationErrors.title = 'El título es requerido';
        }
        if (!formData.content.trim()) {
            validationErrors.content = 'El contenido es requerido';
        }
        if (formData.schedule_publication && !formData.published_at) {
            validationErrors.published_at = 'La fecha de publicación es requerida';
        }

        return validationErrors;
    };

    // Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;

        setErrors({});

        try {
            // Validar formulario
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // Preparar datos para envío
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'featured_image') {
                    if (value instanceof File) {
                        formDataToSend.append(key, value);
                    }
                } else if (key !== 'schedule_publication') {
                    if (value !== null && value !== undefined) {
                        formDataToSend.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
                    }
                }
            });

            await onSubmit(formDataToSend);
        } catch (error) {
            console.error('Error al guardar el post:', error);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Ocurrió un error al guardar el post.'
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
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.general}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Campos Principales */}
            <div className="space-y-6">
                {/* Título */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Título
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={readOnly}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.title
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            } ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        required
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                {/* Editor de Contenido */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido
                    </label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={(content) => !readOnly && setFormData(prev => ({
                            ...prev,
                            content: content
                        }))}
                        error={errors.content}
                        readOnly={readOnly}
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                    )}
                </div>

                {/* Extracto */}
                <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                        Extracto
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        rows="3"
                        value={formData.excerpt}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={readOnly}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            ${errors.excerpt
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            } ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Escribe un breve resumen del artículo..."
                    />
                    {errors.excerpt && (
                        <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                        El extracto se mostrará en la lista de artículos y en los resultados de búsqueda.
                        Si lo dejas vacío, se generará automáticamente a partir del contenido.
                    </p>
                </div>

                {/* Imagen destacada */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Imagen destacada
                    </label>
                    <div className="mt-1 flex items-center">
                        {previewImage ? (
                            <div className="relative inline-block">
                                <img
                                    src={previewImage}
                                    alt="Vista previa"
                                    className="h-32 w-32 object-cover rounded-lg"
                                />
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 text-red-500 hover:text-red-700"
                                    >
                                        <XCircleIcon className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                        ) : !readOnly && (
                            <div className="flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="featured_image"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                        >
                                            <span>Subir una imagen</span>
                                            <input
                                                id="featured_image"
                                                name="featured_image"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleChange}
                                                disabled={readOnly}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {errors.featured_image && (
                        <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>
                    )}
                </div>
            </div>
            {/* SEO Section */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">SEO</h3>
                <div>
                    <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700">
                        Título SEO
                    </label>
                    <input
                        type="text"
                        id="seo_title"
                        name="seo_title"
                        value={formData.seo_title}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={readOnly}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            border-gray-300 focus:ring-indigo-500 focus:border-indigo-500
                            ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Título optimizado para motores de búsqueda"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Si lo dejas vacío, se usará el título del artículo
                    </p>
                </div>
                <div>
                    <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700">
                        Descripción SEO
                    </label>
                    <textarea
                        id="seo_description"
                        name="seo_description"
                        rows="2"
                        value={formData.seo_description}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={readOnly}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                            border-gray-300 focus:ring-indigo-500 focus:border-indigo-500
                            ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Descripción que aparecerá en los resultados de búsqueda"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Si lo dejas vacío, se usará el extracto del artículo
                    </p>
                </div>
            </div>

            {/* Publication Options */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Opciones de publicación</h3>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="is_published"
                            name="is_published"
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={handleChange}
                            disabled={readOnly || formData.schedule_publication}
                            className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded
                                ${readOnly ? 'cursor-not-allowed' : ''}`}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="is_published" className="font-medium text-gray-700">
                            Publicar inmediatamente
                        </label>
                        <p className="text-gray-500">El artículo será visible para todos los usuarios</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="schedule_publication"
                            name="schedule_publication"
                            type="checkbox"
                            checked={formData.schedule_publication}
                            onChange={handleChange}
                            disabled={readOnly || formData.is_published}
                            className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded
                                ${readOnly ? 'cursor-not-allowed' : ''}`}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="schedule_publication" className="font-medium text-gray-700">
                            Programar publicación
                        </label>
                        <p className="text-gray-500">Establece una fecha y hora para publicar automáticamente</p>
                    </div>
                </div>

                {formData.schedule_publication && (
                    <div>
                        <label htmlFor="published_at" className="block text-sm font-medium text-gray-700">
                            Fecha y hora de publicación
                        </label>
                        <input
                            type="datetime-local"
                            id="published_at"
                            name="published_at"
                            value={formData.published_at || ''}
                            onChange={handleChange}
                            readOnly={readOnly}
                            disabled={readOnly}
                            className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                                border-gray-300 focus:ring-indigo-500 focus:border-indigo-500
                                ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            min={new Date().toISOString().slice(0, 16)}
                            required={formData.schedule_publication}
                        />
                        {errors.published_at && (
                            <p className="mt-1 text-sm text-red-600">{errors.published_at}</p>
                        )}
                    </div>
                )}
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
        updated_at: PropTypes.string
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool
};