import React from "react";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/24/solid";

const FeaturedImageSection = ({
    previewImage,
    handleChange,
    removeImage,
    readOnly,
    errors,
}) => (
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
            ) : (
                !readOnly && (
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
                            <p className="text-xs text-gray-500">
                                PNG, JPG, GIF hasta 10MB
                            </p>
                        </div>
                    </div>
                )
            )}
        </div>
        {errors?.featured_image && (
            <p className="mt-1 text-sm text-red-600">{errors.featured_image}</p>
        )}
    </div>
);

FeaturedImageSection.propTypes = {
    previewImage: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    errors: PropTypes.shape({
        featured_image: PropTypes.string,
    }),
};

export default FeaturedImageSection;
