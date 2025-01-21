import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/solid';

export function SkeletonLoader() {
    return (
        <div className="min-h-screen">
            {/* Navbar Skeleton */}
            <header className="fixed top-0 left-0 right-0 w-full bg-transparent z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="hidden md:flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="text-2xl font-bold text-white">
                            TuMarca
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 px-8">
                            <ul className="flex justify-center space-x-8">
                                {[1, 2, 3, 4].map((item) => (
                                    <li key={item}>
                                        <div className="h-4 w-20 bg-white bg-opacity-20 rounded animate-pulse" />
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Contact Button */}
                        <div className="flex items-center">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-white text-white">
                                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                                <span>Llámanos</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navbar */}
                    <div className="md:hidden flex justify-between items-center h-20">
                        <div className="text-2xl font-bold text-white">
                            TuMarca
                        </div>
                        <div className="h-8 w-8 bg-white bg-opacity-20 rounded animate-pulse" />
                    </div>
                </div>
            </header>

            {/* Hero Section Skeleton */}
            <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="text-center text-white space-y-8">
                    {/* Title Skeleton */}
                    <div className="mx-auto h-12 w-64 md:w-96 bg-white bg-opacity-20 rounded-lg animate-pulse" />

                    {/* Subtitle Skeleton */}
                    <div className="mx-auto h-8 w-48 md:w-80 bg-white bg-opacity-20 rounded-lg animate-pulse" />

                    {/* Button Skeleton */}
                    <div className="mx-auto h-12 w-40 bg-white bg-opacity-90 rounded-full animate-pulse" />
                </div>
            </section>

            {/* ARIA Live region */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
            >
                Cargando contenido...
            </div>
        </div>
    );
}