import React from 'react';
import { useLocation } from 'react-router-dom';
import {SEOManager} from '@components/common';

const APP_NAME = window.APP_NAME || 'Mi Sitio';

const defaultSEOConfig = {
  '/': {
    title: `${APP_NAME} | Página Principal`,
    description: `Bienvenido a ${APP_NAME}`
  },
  '/blog': {
    title: `Blog | ${APP_NAME}`,
    description: 'Explora nuestros últimos artículos y novedades'
  },
  '/contacto': {
    title: `Contacto | ${APP_NAME}`,
    description: 'Formulario de contacto'
  },
  '/login': {
    title: `Iniciar Sesión | ${APP_NAME}`,
    description: 'Accede a tu cuenta para gestionar tu contenido'
  },
  '/admin': {
    title: `Panel de Administración | ${APP_NAME}`,
    description: 'Panel de administración'
  },
  '/admin/posts': {
    title: `Gestión de Posts | ${APP_NAME}`,
    description: 'Administración de publicaciones'
  }
};

const SEOComponent = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Encuentra la configuración más específica que coincida con la ruta actual
  const seoConfig = Object.entries(defaultSEOConfig)
    .filter(([path]) => currentPath.startsWith(path))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1];

  // Si no hay configuración específica, usa una configuración por defecto
  // basada en si es una ruta de admin o no
  if (!seoConfig) {
    if (currentPath.startsWith('/admin')) {
      return (
        <SEOManager
          title={`${APP_NAME} | Administración`}
          description="Panel de administración"
        />
      );
    }
    return (
      <SEOManager
        title={APP_NAME}
        description={`Bienvenido a ${APP_NAME}`}
      />
    );
  }

  return (
    <SEOManager
      title={seoConfig.title}
      description={seoConfig.description}
    />
  );
};

// Componente de envoltura para manejar el SEO en toda la aplicación
const SEOProvider = ({ children }) => {
  return (
    <>
      <SEOComponent />
      {children}
    </>
  );
};

export default SEOProvider;