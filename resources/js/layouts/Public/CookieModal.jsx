import React, { useState } from 'react';

const CookieModal = ({ cookieTypes, preferences: initialPreferences, onSave, onClose }) => {
  const [preferences, setPreferences] = useState(initialPreferences);

  const handleToggleCookie = (cookieType) => {
    if (cookieTypes[cookieType].required) return;

    setPreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Preferencias de cookies</h2>
            <button
              onClick={onClose}
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
            {Object.values(cookieTypes).map((cookieType) => (
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
                        checked={preferences[cookieType.id]}
                        onChange={() => handleToggleCookie(cookieType.id)}
                        disabled={cookieType.required}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer
                          ${preferences[cookieType.id] ? 'bg-blue-600' : 'bg-gray-300'}`}
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
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(preferences)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Guardar preferencias
            </button>
          </div>
        </div>
      </div>

      <style>{`
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
    </div>
  );
};

export default CookieModal;