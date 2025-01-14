// components/pages/BlogList.jsx
import React, { useState, useEffect } from 'react';
import { publicPostsService } from '@services/api';
import { SEOManager } from '@components/common';
import BlogListSkeleton from '@components/ui/Skeletons/BlogListSkeleton';
import {PostCard} from '@components/common';

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
    };

    if (loading) return <BlogListSkeleton />;

    if (error) {
        return (
            <>
                <SEOManager
                    title="Error | Blog"
                    description="Ha ocurrido un error al cargar los artículos"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-red-700">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
                    <p className="text-gray-600">No hay posts publicados todavía.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <SEOManager
                title="Blog | Últimos artículos"
                description="Explora nuestros últimos artículos y mantente al día con las últimas novedades"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border`}
                            >
                                Anterior
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 rounded-md ${
                                        currentPage === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-md ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border`}
                            >
                                Siguiente
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
}