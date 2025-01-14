import React, { useEffect } from 'react';

const SEOManager = ({ title, description }) => {
  useEffect(() => {
    // Guardar los valores originales
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content');

    // Actualizar con los nuevos valores
    if (title) {
      document.title = title;
    }

    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Cleanup function para restaurar los valores originales
    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, [title, description]);

  return null;
};

export default SEOManager;