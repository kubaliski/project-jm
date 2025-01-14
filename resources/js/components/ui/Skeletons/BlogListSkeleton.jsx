import React from 'react';
import SEOManager from '@providers/SEOProvider';

export default function BlogListSkeleton() {
    return (
        <>
            <SEOManager
                title="Blog | Cargando..."
                description="Cargando artículos del blog"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="mb-10">
                            <div className="h-60 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}