// components/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
    return (
        <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link to={`/blog/${post.slug}`}>
                {post.featured_image ? (
                    <img
                        src={post.featured_image}
                        alt={post.seo_title || `Imagen del artículo ${post.title}`}
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
                    <p className="text-gray-600 mb-4 line-clamp-3">
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
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
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