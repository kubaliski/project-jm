// components/LatestPosts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicPostsService } from '@services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function LatestPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const response = await publicPostsService.getRecentPosts();
                console.log('Posts recientes:', response);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
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
        );
    }

    if (error) {
        return null; // No mostramos errores en la página de inicio
    }

    if (!Array.isArray(posts) || posts.length === 0) {
        return null; // No mostramos nada si no hay posts
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Últimas Publicaciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <Link to={`/blog/${post.slug}`}>
                                {post.featured_image ? (
                                    <img
                                        src={post.featured_image}
                                        alt={`Imagen del artículo ${post.title}`}
                                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                        <svg
                                            className="w-12 h-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </Link>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="text-gray-900 hover:text-blue-600"
                                    >
                                        {post.title}
                                    </Link>
                                </h3>
                                <div className="text-sm text-gray-500 mb-4">
                                    <span>{post.author?.name}</span>
                                    <span className="mx-2">·</span>
                                    <time dateTime={post.published_at}>
                                        {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })}
                                    </time>
                                </div>
                                {post.excerpt && (
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                )}
                                <Link
                                    to={`/blog/${post.slug}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
                                >
                                    Leer más
                                    <svg
                                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        to="/blog"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                        Ver todas las publicaciones
                    </Link>
                </div>
            </div>
        </section>
    );
}