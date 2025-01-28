import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SEOManager } from '@components/common';
import BlogPostSkeleton from '@components/ui/Skeletons/BlogPostSkeleton';
import OptimizedImage from '@components/OptimizedImage';
import DOMPurify from 'dompurify';
import { fetchPostBySlug } from '@store/landing/thunks/publicPostsThunks';
import {
    selectCurrentPost,
    selectSpecificLoadingState,
    selectSpecificErrorState,
    selectIsPostCached,
} from '@store/landing/selectors/publicPostsSelectors';

// Configurar DOMPurify para imágenes responsivas
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    if (node.nodeName === 'IMG') {
        // Convertir las imágenes del contenido a lazy loading
        node.setAttribute('loading', 'lazy');
        // Añadir clases para estilos consistentes
        node.classList.add('rounded-lg', 'shadow-lg', 'my-4');
    }
});

export default function BlogPost() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const post = useSelector(selectCurrentPost);
    const isLoading = useSelector(state => selectSpecificLoadingState(state, 'currentPost'));
    const error = useSelector(state => selectSpecificErrorState(state, 'currentPost'));
    const isPostCached = useSelector(state => selectIsPostCached(state, slug));

    useEffect(() => {
        const loadPost = async () => {
            if (!isPostCached) {
                try {
                    const resultAction = await dispatch(fetchPostBySlug(slug)).unwrap();
                    if (!resultAction) {
                        navigate('/404', { replace: true });
                    }
                } catch (err) {
                    if (err?.response?.status === 404) {
                        navigate('/404', { replace: true });
                    }
                }
            }
        };

        loadPost();
    }, [dispatch, slug, navigate, isPostCached]);

    const sanitizeContent = (content) => {
        return DOMPurify.sanitize(content, {
            ADD_ATTR: ['target', 'aria-label', 'loading', 'class'],
            ADD_TAGS: ['iframe'],
            FORCE_BODY: true,
        });
    };

    if (isLoading) {
        return <BlogPostSkeleton />;
    }

    if (error) {
        return (
            <>
                <SEOManager
                    title="Error | No se pudo cargar el artículo"
                    description="Ha ocurrido un error al cargar el artículo"
                />
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div role="alert" className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-red-700">{error}</p>
                                <button
                                    onClick={() => dispatch(fetchPostBySlug(slug))}
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

    if (!post) return null;

    const formattedDate = format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es });

    return (
        <>
            <SEOManager
                title={post.seo_title || post.title}
                description={post.seo_description || post.excerpt}
                image={post.featured_image ? post.featured_image.formats.card : null}
            />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav aria-label="Navegación del blog" className="mb-8">
                    <Link
                        to="/blog"
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    >
                        <svg
                            className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al blog
                    </Link>
                </nav>

                <article
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    itemScope
                    itemType="http://schema.org/BlogPosting"
                >
                    {post.featured_image && (
                        <div className="relative">
                            <OptimizedImage
                                image={post.featured_image}
                                variant="featured"
                                alt={post.seo_title || post.title}
                                containerClassName="aspect-w-16 aspect-h-9"
                                className="rounded-t-xl"
                                priority={true} // LCP optimization
                                itemProp="image"
                            />
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        <header className="mb-8">
                            <h1
                                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
                                itemProp="headline"
                            >
                                {post.title}
                            </h1>

                            <div
                                className="flex items-center text-gray-600 text-sm"
                                aria-label="Metadatos del artículo"
                            >
                                {post.user && (
                                    <>
                                        <span className="font-medium" itemProp="author">
                                            <span className="sr-only">Autor: </span>
                                            {post.user.name}
                                        </span>
                                        <span className="mx-2" aria-hidden="true">·</span>
                                    </>
                                )}
                                <time
                                    dateTime={post.published_at}
                                    className="italic"
                                    itemProp="datePublished"
                                >
                                    <span className="sr-only">Publicado el </span>
                                    {formattedDate}
                                </time>
                            </div>
                        </header>

                        {post.excerpt && (
                            <div
                                className="mb-8 text-lg text-gray-600 font-serif border-l-4 border-blue-500 pl-4 italic"
                                itemProp="abstract"
                            >
                                {post.excerpt}
                            </div>
                        )}

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
                                prose-li:mb-1
                                prose-a:focus:outline-none prose-a:focus:ring-2 prose-a:focus:ring-blue-500 prose-a:focus:ring-offset-2 prose-a:rounded"
                            dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
                            itemProp="articleBody"
                        />
                    </div>
                </article>

                <footer className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        {post.user && (
                            <div className="text-sm text-gray-500">
                                <p>
                                    Escrito por{' '}
                                    <span className="font-medium">{post.user.name}</span>
                                </p>
                            </div>
                        )}
                        <Link
                            to="/blog"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        >
                            Ver más artículos
                        </Link>
                    </div>
                </footer>
            </main>
        </>
    );
}