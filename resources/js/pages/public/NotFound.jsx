import React from 'react';
import { Link } from 'react-router-dom';
import SEOManager from '../../components/common/SEOManager';

export default function NotFound() {
    return (
        <>
            <SEOManager
                title="Página no encontrada | 404"
                description="La página que estás buscando no existe o ha sido movida"
            />
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                        <div className="mb-6">
                            <svg
                                className="mx-auto h-24 w-24 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <h2 className="text-xl text-gray-700 mb-6">
                            Página no encontrada
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Lo sentimos, la página que estás buscando no existe o ha sido movida.
                        </p>
                        <Link
                            to="/"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}