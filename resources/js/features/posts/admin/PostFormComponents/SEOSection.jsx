import React from "react";
import PropTypes from "prop-types";
import { FormInput } from "@/components/common";

const SEOSection = ({ formData, handleChange, readOnly }) => (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">SEO</h3>
        <FormInput
            id="seo_title"
            name="seo_title"
            label="Título SEO"
            value={formData.seo_title}
            onChange={handleChange}
            readOnly={readOnly}
            disabled={readOnly}
            placeholder="Título optimizado para motores de búsqueda"
            helperText="Si lo dejas vacío, se usará el título del artículo"
        />
        <FormInput
            id="seo_description"
            name="seo_description"
            type="textarea"
            label="Descripción SEO"
            value={formData.seo_description}
            onChange={handleChange}
            readOnly={readOnly}
            disabled={readOnly}
            rows={2}
            placeholder="Descripción que aparecerá en los resultados de búsqueda"
            helperText="Si lo dejas vacío, se usará el extracto del artículo"
        />
    </div>
);

SEOSection.propTypes = {
    formData: PropTypes.shape({
        seo_title: PropTypes.string,
        seo_description: PropTypes.string,
    }).isRequired,
    handleChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
};

export default SEOSection;
