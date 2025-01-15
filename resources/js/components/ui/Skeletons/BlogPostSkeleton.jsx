import React from 'react';
import {SEOManager} from '@components/common';

export default function BlogPostSkeleton() {
    return (
        <>
            <SEOManager
                title="Cargando artículo..."
                description="Cargando contenido del artículo"
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    {/* Título del post */}
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

                    {/* Metadata (autor y fecha) */}
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>

                    {/* Imagen destacada */}
                    <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>

                    {/* Contenido del post */}
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        </>
    );
}