import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicPostsService } from '@services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SEOManager } from '@components/common';
import BlogPostSkeleton from '@components/ui/Skeletons/BlogPostSkeleton';

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

    if (loading) return <BlogPostSkeleton />;

    if (error) {
        return (
            <>
                <SEOManager
                    title="Error | No se pudo cargar el artículo"
                    description="Ha ocurrido un error al cargar el artículo"
                />
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
            </>
        );
    }

    if (!post) return null;

    return (
        <>
            <SEOManager
                title={post.seo_title || post.title}
                description={post.seo_description || post.excerpt}
            />
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Botón Volver */}
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

                {/* Imagen destacada */}
                {post.featured_image && (
                    <div className="mb-8 relative">
                        <img
                            src={post.featured_image}
                            alt={post.seo_title || `Imagen del artículo ${post.title}`}
                            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                        />
                    </div>
                )}

                {/* Encabezado del post */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center text-gray-600 text-sm">
                        {post.user && (
                            <>
                                <span className="font-medium">{post.user.name}</span>
                                <span className="mx-2">·</span>
                            </>
                        )}
                        <time dateTime={post.published_at} className="italic">
                            {format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })}
                        </time>
                    </div>
                </header>

                {/* Extracto */}
                {post.excerpt && (
                    <div className="mb-8 text-lg text-gray-600 font-serif border-l-4 border-blue-500 pl-4 italic">
                        {post.excerpt}
                    </div>
                )}

                {/* Contenido del post */}
                <div
                    className="prose prose-lg max-w-none
                        prose-headings:font-semibold
                        prose-h1:text-3xl prose-h1:mb-4
                        prose-h2:text-2xl prose-h2:mb-3
                        prose-h3:text-xl prose-h3:mb-3
                        prose-p:mb-4 prose-p:leading-relaxed
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-lg prose-img:shadow-lg
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                        prose-blockquote:pl-4 prose-blockquote:italic
                        prose-strong:font-bold prose-em:italic
                        prose-ul:list-disc prose-ol:list-decimal
                        prose-li:mb-1"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer del artículo */}
                <footer className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {post.user && (
                                <p>Escrito por <span className="font-medium">{post.user.name}</span></p>
                            )}
                        </div>
                        <Link
                            to="/blog"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Ver más artículos
                        </Link>
                    </div>
                </footer>
            </article>
        </>
    );
}