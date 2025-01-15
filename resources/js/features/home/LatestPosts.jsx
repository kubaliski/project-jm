// components/LatestPosts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicPostsService } from '@services/api';
import { PostCard } from '@components/common';

export default function LatestPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const response = await publicPostsService.getRecentPosts();
                setPosts(response.data?.posts || []);
            } catch (error) {
                console.error('Error al cargar los posts recientes:', error);
                setError('No se pudieron cargar los posts recientes');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPosts();
    }, []);

    if (loading) {
        return (
            <section
                className="py-20 bg-gray-50"
                aria-label="Cargando últimas publicaciones"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Últimas Publicaciones</h2>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        role="status"
                        aria-busy="true"
                        aria-label="Cargando artículos"
                    >
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
                                aria-hidden="true"
                            >
                                <div className="w-full h-48 bg-gray-200"/>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"/>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"/>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"/>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                className="py-20 bg-gray-50"
                aria-label="Error al cargar publicaciones"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="text-center text-red-600"
                        role="alert"
                    >
                        <p className="text-lg">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!Array.isArray(posts) || posts.length === 0) {
        return (
            <section
                className="py-20 bg-gray-50"
                aria-label="No hay publicaciones disponibles"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-600">
                        No hay publicaciones disponibles en este momento.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-20 bg-gray-50"
            aria-labelledby="latest-posts-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="latest-posts-heading"
                    className="text-3xl font-bold text-center mb-12"
                >
                    Últimas Publicaciones
                </h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    role="feed"
                    aria-label="Lista de publicaciones recientes"
                >
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        to="/blog"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:py-4 md:text-lg md:px-10"
                        aria-label="Ver todas las publicaciones del blog"
                    >
                        Ver todas las publicaciones
                    </Link>
                </div>
            </div>
        </section>
    );
}