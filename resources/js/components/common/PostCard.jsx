import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PropTypes from 'prop-types';
import OptimizedImage from '@/components/OptimizedImage';

const PostCard = ({ post, priority = false }) => {
    const formattedDate = format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es });
    const postUrl = `/blog/${post.slug}`;

    return (
        <article
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            itemScope
            itemType="http://schema.org/BlogPosting"
        >
            <Link
                to={postUrl}
                className="block w-full relative"
                aria-labelledby={`post-title-${post.id}`}
            >
                <div className="relative w-full pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                    <div className="absolute inset-0">
                        {post.featured_image ? (
                            <OptimizedImage
                                image={post.featured_image}
                                variant="card"
                                alt={post.seo_title || post.title}
                                priority={priority}
                                objectFit="cover"
                                containerClassName="h-full"
                                className="transition-all duration-300 group-hover:opacity-90"
                                itemProp="image"
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center bg-gray-200"
                                aria-label="Imagen no disponible para este artículo"
                            >
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
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
                    </div>
                </div>
            </Link>

            <div className="p-6 flex-1 flex flex-col">
                <h2
                    id={`post-title-${post.id}`}
                    className="text-xl font-semibold mb-2"
                    itemProp="headline"
                >
                    <Link
                        to={postUrl}
                        className="text-gray-900 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    >
                        {post.title}
                    </Link>
                </h2>

                <div
                    className="text-sm text-gray-500 mb-4 flex items-center gap-2"
                    aria-label="Metadatos del artículo"
                >
                    {post.author?.name && (
                        <>
                            <span itemProp="author">
                                <span className="sr-only">Autor: </span>
                                {post.author.name}
                            </span>
                            <span aria-hidden="true">·</span>
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

                {post.excerpt && (
                    <p
                        className="text-gray-600 mb-4 line-clamp-3 flex-1"
                        aria-label="Extracto del artículo"
                        itemProp="description"
                    >
                        {post.excerpt}
                    </p>
                )}

                <Link
                    to={postUrl}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded mt-auto"
                    aria-label={`Leer más sobre ${post.title}`}
                >
                    <span>Leer más</span>
                    <svg
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </div>
        </article>
    );
};

// PropTypes se mantienen igual
PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        featured_image: PropTypes.shape({
            formats: PropTypes.object.isRequired,
            metadata: PropTypes.object
        }),
        seo_title: PropTypes.string,
        excerpt: PropTypes.string,
        author: PropTypes.shape({
            name: PropTypes.string
        }),
        published_at: PropTypes.string.isRequired
    }).isRequired,
    priority: PropTypes.bool
};

export default PostCard;