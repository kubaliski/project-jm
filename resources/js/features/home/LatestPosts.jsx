// components/LatestPosts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicPostsService } from '@services/api';
import {PostCard} from '@components/common';

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
        return null;
    }

    if (!Array.isArray(posts) || posts.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Últimas Publicaciones</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
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