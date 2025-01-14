// resources/js/pages/public/blog/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicPostsService } from '../../../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await publicPostsService.getBySlug(slug);
                setPost(response.data.post);

                // Actualizar meta tags para SEO
                document.title = response.data.post.seo.title;
                const metaDescription = document.querySelector('meta[name="description"]');
                if (metaDescription) {
                    metaDescription.setAttribute('content', response.data.post.seo.description);
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    navigate('/404', { replace: true });
                } else {
                    setError('No se pudo cargar el post');
                    console.error('Error:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        );
    }

    if (!post) return null;

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                to="/blog"
                className="text-blue-600 hover:text-blue-800 mb-8 inline-flex items-center group"
            >
                <svg
                    className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al blog
            </Link>

            {post.featured_image && (
                <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-[400px] object-cover rounded-lg mb-8"
                />
            )}

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-8">
                <span>{post.author.name}</span>
                <span className="mx-2">·</span>
                <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })}
                </time>
            </div>

            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    );
}