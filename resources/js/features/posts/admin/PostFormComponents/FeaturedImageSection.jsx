import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/24/solid";
import OptimizedImage from "@components/OptimizedImage";
import clsx from "clsx";

const FeaturedImageSection = ({
    previewImage,
    handleChange,
    removeImage,
    readOnly,
    errors,
}) => {
    useEffect(() => {
        if (previewImage && typeof previewImage === 'object') {
            console.log('FeaturedImageSection - Image formats:', previewImage.formats);
        }
    }, [previewImage]);

    const getImageDisplay = () => {
        if (!previewImage) return null;

        if (typeof previewImage === 'string') {
            return (
                <div className="w-full h-full">
                    <img
                        src={previewImage}
                        alt="Vista previa"
                        className="rounded-lg object-cover w-full h-full"
                    />
                </div>
            );
        }

        if (previewImage?.formats) {
            return (
                <OptimizedImage
                    image={previewImage}
                    variant="card"
                    alt="Vista previa"
                    containerClassName="w-full h-full rounded-lg overflow-hidden"
                    priority={true}
                />
            );
        }

        return null;
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Imagen destacada
            </label>

            {previewImage ? (
                <div className="relative w-full max-w-2xl mx-auto">
                    <div className="relative pt-[40%] bg-gray-100 rounded-lg overflow-hidden">
                        <div className="absolute inset-0">
                            {getImageDisplay() || (
                                <div className="h-full flex items-center justify-center bg-red-50 p-4 text-red-600 text-sm">
                                    Error al cargar la imagen: formato no soportado
                                </div>
                            )}
                        </div>
                    </div>

                    {!readOnly && (
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white rounded-full shadow-sm"
                        >
                            <XCircleIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            ) : (
                !readOnly && (
                    <div
                        className={clsx(
                            "relative w-full max-w-2xl mx-auto",
                            "px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg",
                            "hover:border-gray-400 transition-colors duration-200",
                            "cursor-pointer bg-gray-50"
                        )}
                    >
                        <div className="text-center">
                            <div className="mt-1 flex justify-center">
                                <label
                                    htmlFor="featured_image"
                                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                >
                                    <span>Subir una imagen</span>
                                    <input
                                        id="featured_image"
                                        name="featured_image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        className="sr-only"
                                        onChange={handleChange}
                                        disabled={readOnly}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                PNG, JPG, GIF o WebP hasta 10MB
                            </p>
                        </div>
                    </div>
                )
            )}

            {errors?.featured_image && (
                <p className="text-sm text-red-600 mt-1">{errors.featured_image}</p>
            )}
        </div>
    );
};

FeaturedImageSection.propTypes = {
    previewImage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            formats: PropTypes.object,
            metadata: PropTypes.object
        })
    ]),
    handleChange: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    errors: PropTypes.shape({
        featured_image: PropTypes.string,
    }),
};

export default FeaturedImageSection;