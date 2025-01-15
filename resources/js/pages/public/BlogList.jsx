// components/pages/BlogList.jsx
import React, { useState, useEffect } from 'react';
import { publicPostsService } from '@services/api';
import { SEOManager } from '@components/common';
import BlogListSkeleton from '@components/ui/Skeletons/BlogListSkeleton';
import { PostCard } from '@components/common';

const POSTS_PER_PAGE = 9; // 3x3 grid

export default function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await publicPostsService.getAll();
                setPosts(response.data?.posts || []);
            } catch (error) {
                console.error('Error al cargar los posts:', error);
                setError('No se pudieron cargar los posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Anunciar cambio de página para lectores de pantalla
        const message = `Página ${pageNumber} de ${totalPages}, mostrando posts del ${indexOfFirstPost + 1} al ${Math.min(indexOfLastPost, posts.length)}`;
        announcePageChange(message);
    };

    // Función para anunciar cambios a lectores de pantalla
    const announcePageChange = (message) => {
        const announcement = document.getElementById('page-change-announcement');
        if (announcement) {
            announcement.textContent = message;
        }
    };

    if (loading) {
        return (
            <div
                role="status"
                aria-busy="true"
                aria-label="Cargando artículos del blog"
            >
                <BlogListSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <SEOManager
                    title="Error | Blog"
                    description="Ha ocurrido un error al cargar los artículos"
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
                    <div
                        role="alert"
                        className="bg-red-50 border-l-4 border-red-400 p-4"
                    >
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-red-700">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Intentar de nuevo
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!Array.isArray(posts) || posts.length === 0) {
        return (
            <>
                <SEOManager
                    title="Blog | No hay artículos"
                    description="No hay posts publicados todavía"
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
                    <p
                        className="text-gray-600"
                        role="status"
                    >
                        No hay posts publicados todavía.
                    </p>
                </main>
            </>
        );
    }

    return (
        <>
            <SEOManager
                title="Blog | Últimos artículos"
                description="Explora nuestros últimos artículos y mantente al día con las últimas novedades"
            />
            <main
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20"
                aria-labelledby="blog-heading"
            >
                <h1
                    id="blog-heading"
                    className="text-4xl font-bold text-gray-900 mb-8"
                >
                    Blog
                </h1>

                {/* Anuncio para lectores de pantalla */}
                <div
                    id="page-change-announcement"
                    className="sr-only"
                    role="status"
                    aria-live="polite"
                ></div>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    role="feed"
                    aria-label="Lista de artículos del blog"
                >
                    {currentPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <nav
                        className="mt-8 flex justify-center"
                        role="navigation"
                        aria-label="Paginación de artículos"
                    >
                        <ul className="flex items-center space-x-2">
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border`}
                                    aria-label="Ir a la página anterior"
                                    aria-disabled={currentPage === 1}
                                >
                                    <span aria-hidden="true">←</span>
                                    <span className="sr-only">Anterior</span>
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                const isCurrent = currentPage === pageNumber;

                                return (
                                    <li key={pageNumber}>
                                        <button
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                isCurrent
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            } border`}
                                            aria-label={`Página ${pageNumber}`}
                                            aria-current={isCurrent ? 'page' : undefined}
                                        >
                                            {pageNumber}
                                        </button>
                                    </li>
                                );
                            })}

                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border`}
                                    aria-label="Ir a la página siguiente"
                                    aria-disabled={currentPage === totalPages}
                                >
                                    <span aria-hidden="true">→</span>
                                    <span className="sr-only">Siguiente</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </main>
        </>
    );
}