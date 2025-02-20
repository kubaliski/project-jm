import React, { useState, useEffect, lazy, Suspense } from 'react';

// Constantes movidas fuera del componente
const COOKIE_TYPES = {
  necessary: {
    id: 'necessary',
    title: 'Cookies Necesarias',
    description: 'Son esenciales para el funcionamiento básico del sitio web.',
    required: true
  },
  analytics: {
    id: 'analytics',
    title: 'Cookies Analíticas',
    description: 'Nos ayudan a entender cómo interactúas con el sitio web.',
    required: false
  },
  marketing: {
    id: 'marketing',
    title: 'Cookies de Marketing',
    description: 'Se utilizan para mostrar publicidad relevante.',
    required: false
  },
  preferences: {
    id: 'preferences',
    title: 'Cookies de Preferencias',
    description: 'Guardan tus preferencias de navegación.',
    required: false
  }
};

// Componente del modal separado y cargado de forma diferida
const CookieModal = lazy(() => import('./CookieModal'));

// Banner simple inicial
const CookieBanner = ({ onAcceptAll, onConfigure }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm text-gray-600 mb-2 md:mb-0 md:mr-4">
          Utilizamos cookies para mejorar tu experiencia.
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onConfigure}
            className="text-gray-600 underline hover:text-gray-900"
          >
            Configurar
          </button>
          <button
            onClick={onAcceptAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CookieManager = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Cargar preferencias de manera diferida
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedPreferences = localStorage.getItem('cookiePreferences');
      if (!savedPreferences) {
        setShowBanner(true);
      } else {
        setCookiePreferences(JSON.parse(savedPreferences));
      }
    }, 2000); // Retrasar la aparición del banner

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = Object.keys(COOKIE_TYPES).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});

    saveCookiePreferences(allAccepted);
  };

  const saveCookiePreferences = (preferences) => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowBanner(false);
    setShowManager(false);
    setCookiePreferences(preferences);
  };

  if (!showBanner && !showManager) return null;

  return (
    <>
      {showBanner && (
        <CookieBanner
          onAcceptAll={handleAcceptAll}
          onConfigure={() => setShowManager(true)}
        />
      )}

      {showManager && (
        <Suspense fallback={null}>
          <CookieModal
            cookieTypes={COOKIE_TYPES}
            preferences={cookiePreferences}
            onSave={saveCookiePreferences}
            onClose={() => setShowManager(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default CookieManager;