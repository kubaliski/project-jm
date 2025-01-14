import React from 'react';
import SEOManager from '@providers/SEOProvider';

export default function BlogListSkeleton() {
    return (
        <>
            <SEOManager
                title="Blog | Cargando..."
                description="Cargando artículos del blog"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                {/* Título skeleton */}
                <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
                {/* Grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(9)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                            {/* Imagen skeleton */}
                            <div className="w-full h-48 bg-gray-200"></div>
                            <div className="p-6">
                                {/* Título del artículo skeleton */}
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                {/* Metadata skeleton (autor y fecha) */}
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                                </div>
                                {/* Extracto skeleton */}
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                                {/* "Leer más" skeleton */}
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Paginación skeleton */}
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
                        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </div>
        </>
    );
}