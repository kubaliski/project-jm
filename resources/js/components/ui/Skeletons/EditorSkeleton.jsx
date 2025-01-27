// resources/js/components/common/skeletons/EditorSkeleton.jsx
import React from 'react';

const EditorSkeleton = () => (
    <div className="border border-gray-200 rounded-md shadow-sm">
        <div className="space-y-2">
            {/* Barra de menú skeleton */}
            <div className="h-8 bg-gray-100 animate-pulse rounded" />

            {/* Barra de herramientas skeleton - 2 filas */}
            <div className="space-y-1">
                <div className="h-10 bg-gray-100 animate-pulse rounded" />
                <div className="h-10 bg-gray-100 animate-pulse rounded" />
            </div>

            {/* Área principal del editor skeleton */}
            <div className="h-[424px] bg-gray-100 animate-pulse rounded border border-gray-200">
                {/* Líneas de texto simuladas */}
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
            </div>

            {/* Barra de estado skeleton */}
            <div className="h-6 bg-gray-100 animate-pulse rounded" />
        </div>
    </div>
);

export default EditorSkeleton;