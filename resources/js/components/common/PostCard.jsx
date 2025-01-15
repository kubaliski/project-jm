// components/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
    const formattedDate = format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es });
    const postUrl = `/blog/${post.slug}`;

    return (
        <article
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            aria-labelledby={`post-title-${post.id}`}
        >
            <Link
                to={postUrl}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block"
                aria-labelledby={`post-title-${post.id}`}
            >
                {post.featured_image ? (
                    <img
                        src={post.featured_image}
                        alt={post.seo_title || post.title}
                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    />
                ) : (
                    <div
                        className="w-full h-48 bg-gray-200 flex items-center justify-center"
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
            </Link>
            <div className="p-6">
                <h3 id={`post-title-${post.id}`} className="text-xl font-semibold mb-2">
                    <Link
                        to={postUrl}
                        className="text-gray-900 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    >
                        {post.title}
                    </Link>
                </h3>
                <div
                    className="text-sm text-gray-500 mb-4"
                    aria-label="Metadatos del post"
                >
                    {post.author?.name && (
                        <span>
                            <span className="sr-only">Autor:</span>
                            {post.author.name}
                        </span>
                    )}
                    {post.author?.name && <span className="mx-2" aria-hidden="true">·</span>}
                    <time
                        dateTime={post.published_at}
                        aria-label={`Publicado el ${formattedDate}`}
                    >
                        {formattedDate}
                    </time>
                </div>
                {post.excerpt && (
                    <p
                        className="text-gray-600 mb-4 line-clamp-3"
                        aria-label="Extracto del artículo"
                    >
                        {post.excerpt}
                    </p>
                )}
                <Link
                    to={postUrl}
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label={`Leer más sobre ${post.title}`}
                >
                    <span>Leer más</span>
                    <svg
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </article>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        slug: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        featured_image: PropTypes.string,
        seo_title: PropTypes.string,
        excerpt: PropTypes.string,
        author: PropTypes.shape({
            name: PropTypes.string
        }),
        published_at: PropTypes.string.isRequired
    }).isRequired
};

export default PostCard;