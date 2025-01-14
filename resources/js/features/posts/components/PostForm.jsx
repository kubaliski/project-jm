import React, { useState, useEffect } from 'react';
import { formatDateForInput } from '@utils/dateUtils';
import { XCircleIcon } from '@heroicons/react/24/solid';
import {RichTextEditor} from '@components/common';

export default function PostForm({ post = null, onSubmit, onCancel }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
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

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (post) {
            setFormData({
                ...post,
                schedule_publication: post.published_at !== null && !post.is_published,
                published_at: formatDateForInput(post.published_at)
            });

            if (post.featured_image) {
                setPreviewImage(post.featured_image);
            }
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file' && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
            setPreviewImage(URL.createObjectURL(files[0]));
        } else if (type === 'checkbox') {
            if (name === 'is_published' && checked) {
                setFormData(prev => ({
                    ...prev,
                    is_published: checked,
                    schedule_publication: false,
                    published_at: null
                }));
            } else if (name === 'schedule_publication') {
                setFormData(prev => ({
                    ...prev,
                    schedule_publication: checked,
                    is_published: false,
                    published_at: checked ? new Date().toISOString().slice(0, 16) : null
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, featured_image: null }));
        setPreviewImage(null);
        if (document.getElementById('featured_image')) {
            document.getElementById('featured_image').value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'featured_image') {
                    if (formData[key] instanceof File) {
                        formDataToSend.append(key, formData[key]);
                    }
                } else if (key !== 'schedule_publication') {
                    if (formData[key] !== null && formData[key] !== undefined) {
                        if (typeof formData[key] === 'boolean') {
                            formDataToSend.append(key, formData[key] ? '1' : '0');
                        } else {
                            formDataToSend.append(key, formData[key]);
                        }
                    }
                }
            });

            await onSubmit(formDataToSend);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: 'Ocurrió un error al guardar el post.'
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
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                        ${errors.title
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
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
                    onChange={handleChange}
                    error={errors.content}
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
                    className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 sm:text-sm
                        ${errors.excerpt
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
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
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 text-red-500 hover:text-red-700"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>
                    ) : (
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

            {/* SEO */}
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Descripción que aparecerá en los resultados de búsqueda"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Si lo dejas vacío, se usará el extracto del artículo
                    </p>
                </div>
            </div>

            {/* Opciones de publicación */}
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
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                            disabled={formData.is_published}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        {errors.published_at && (
                            <p className="mt-1 text-sm text-red-600">{errors.published_at}</p>
                        )}
                    </div>
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
                    post ? 'Actualizar' : 'Crear'
                    )}
                </button>
            </div>
        </form>
    );
}