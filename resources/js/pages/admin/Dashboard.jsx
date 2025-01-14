import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            {/* Cabecera de bienvenida */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Bienvenido, {user?.name}
                </h1>
                <p className="mt-1 text-gray-600">
                    Este es tu panel de administración.
                </p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Posts</h3>
                            <p className="mt-1 text-3xl font-semibold text-indigo-600">0</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        Total de posts publicados
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Noticias</h3>
                            <p className="mt-1 text-3xl font-semibold text-green-600">0</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        Total de noticias publicadas
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Visitas</h3>
                            <p className="mt-1 text-3xl font-semibold text-purple-600">0</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        Visitas totales
                    </p>
                </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad reciente</h2>
                <div className="border-t border-gray-200">
                    <p className="py-4 text-gray-500 text-sm">No hay actividad reciente</p>
                </div>
            </div>
        </div>
    );
}