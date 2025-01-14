<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PublicPostController extends Controller
{
    public function index()
    {
        $posts = Post::with('user')
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json([
            'posts' => $posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'featured_image' => $post->featured_image,
                    'published_at' => $post->published_at,
                    'author' => [
                        'name' => $post->user->name,
                    ]
                ];
            })
        ]);
    }

    public function show($slug)
    {
        $post = Post::with('user')
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'content' => $post->content,
                'excerpt' => $post->excerpt,
                'featured_image' => $post->featured_image,
                'published_at' => $post->published_at,
                'author' => [
                    'name' => $post->user->name,
                ],
                'seo' => [
                    'title' => $post->seo_title ?? $post->title,
                    'description' => $post->seo_description ?? $post->excerpt,
                ]
            ]
        ]);
    }
    public function latestPosts()
{
    try {
        // Empezamos con un log inicial
        \Log::info('Starting latestPosts query');

        $query = Post::with('user')
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->take(3);

        // Log de la consulta SQL
        \Log::info('SQL Query:', [
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings()
        ]);

        $latestPosts = $query->get();

        // Log del resultado
        \Log::info('Query result count:', [
            'count' => $latestPosts->count()
        ]);

        // Si hay resultados, también loguemos los IDs
        if ($latestPosts->count() > 0) {
            \Log::info('Found posts:', [
                'ids' => $latestPosts->pluck('id')->toArray()
            ]);
        }

        return response()->json([
            'posts' => $latestPosts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'featured_image' => $post->featured_image,
                    'published_at' => $post->published_at,
                    'author' => [
                        'name' => $post->user->name,
                    ]
                ];
            })
        ]);
    } catch (\Exception $e) {
        \Log::error('Error in latestPosts:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'error' => 'Error retrieving latest posts'
        ], 500);
    }
}
}