import React from "react";
import PropTypes from "prop-types";
import { FormInput } from "@/components/common";

const PublicationSection = ({ formData, handleChange, readOnly, errors }) => (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">
            Opciones de publicación
        </h3>

        {/* Publicar inmediatamente */}
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
                        ${readOnly ? "cursor-not-allowed" : ""}`}
                />
            </div>
            <div className="ml-3 text-sm">
                <label
                    htmlFor="is_published"
                    className="font-medium text-gray-700"
                >
                    Publicar inmediatamente
                </label>
                <p className="text-gray-500">
                    El artículo será visible para todos los usuarios
                </p>
            </div>
        </div>

        {/* Programar publicación */}
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
                        ${readOnly ? "cursor-not-allowed" : ""}`}
                />
            </div>
            <div className="ml-3 text-sm">
                <label
                    htmlFor="schedule_publication"
                    className="font-medium text-gray-700"
                >
                    Programar publicación
                </label>
                <p className="text-gray-500">
                    Establece una fecha y hora para publicar automáticamente
                </p>
            </div>
        </div>

        {formData.schedule_publication && (
            <FormInput
                id="published_at"
                name="published_at"
                type="datetime-local"
                label="Fecha y hora de publicación"
                value={formData.published_at || ""}
                onChange={handleChange}
                readOnly={readOnly}
                disabled={readOnly}
                min={new Date().toISOString().slice(0, 16)}
                required={formData.schedule_publication}
                error={errors?.published_at}
            />
        )}
    </div>
);

PublicationSection.propTypes = {
    formData: PropTypes.shape({
        is_published: PropTypes.bool.isRequired,
        schedule_publication: PropTypes.bool.isRequired,
        published_at: PropTypes.string,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    errors: PropTypes.shape({
        published_at: PropTypes.string,
    }),
};

export default PublicationSection;
