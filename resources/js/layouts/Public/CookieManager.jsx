import React, { useState, useEffect, Fragment } from 'react';

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

const CookieManager = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (!savedPreferences) {
      setShowBanner(true);
    } else {
      setCookiePreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = Object.keys(COOKIE_TYPES).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});

    saveCookiePreferences(allAccepted);
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(cookiePreferences);
  };

  const saveCookiePreferences = (preferences) => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowBanner(false);
    setShowManager(false);
    setCookiePreferences(preferences);
  };

  const handleToggleCookie = (cookieType) => {
    if (COOKIE_TYPES[cookieType].required) return;

    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType]
    }));
  };

  if (!showBanner && !showManager) return null;

  return (
    <>
      {/* Banner principal */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  Este sitio web utiliza cookies propias y de terceros para mejorar nuestros servicios
                  y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus
                  hábitos de navegación.
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => setShowManager(true)}
                  className="text-gray-600 underline hover:text-gray-900"
                >
                  Configurar
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Aceptar todas
                </button>
                <button
                  onClick={() => saveCookiePreferences({ ...cookiePreferences, necessary: true })}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Cerrar aviso de cookies"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión de cookies */}
      {showManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Preferencias de cookies</h2>
                <button
                  onClick={() => setShowManager(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Cerrar gestor de cookies"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {Object.values(COOKIE_TYPES).map((cookieType) => (
                  <div
                    key={cookieType.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {cookieType.title}
                        </h3>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            checked={cookiePreferences[cookieType.id]}
                            onChange={() => handleToggleCookie(cookieType.id)}
                            disabled={cookieType.required}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer
                              ${cookiePreferences[cookieType.id] ? 'bg-blue-600' : 'bg-gray-300'}`}
                          />
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {cookieType.description}
                      </p>
                      {cookieType.required && (
                        <span className="inline-block mt-2 text-xs text-gray-500">
                          (Requerida)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setShowManager(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Guardar preferencias
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #2563eb;
        }
        .toggle-label {
          transition: background-color 0.2s ease-in;
        }
        .toggle-checkbox {
          right: 4px;
          transition: all 0.2s ease-in;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #2563eb;
        }
      `}</style>
    </>
  );
};

export default CookieManager;