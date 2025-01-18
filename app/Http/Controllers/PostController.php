<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\Post\StoreRequest;
use App\Http\Requests\Post\UpdateRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post');
    }

    public function index()
    {
        $posts = Post::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')
                ->store('posts/images', 'public');
            $validated['featured_image'] = Storage::disk('public')->url($path);
        }

        // Crear el post primero para tener una instancia
        $post = $request->user()->posts()->create($validated);

        // Manejar la fecha de publicación
        if ($validated['is_published']) {
            $this->authorize('publish', $post);
            $post->published_at = now();
        } elseif ($request->filled('published_at')) {
            $this->authorize('publish', $post);
            $post->published_at = $validated['published_at'];
        }

        $post->save();
        return response()->json($post, 201);
    }

    public function show(Post $post)
    {
        return response()->json($post->load('user'));
    }

    public function update(UpdateRequest $request, Post $post)
    {
        $validated = $request->validated();

        // Manejar la fecha de publicación
        if ($validated['is_published'] && !$post->published_at) {
            $this->authorize('publish', $post);
            $validated['published_at'] = now();
        } elseif ($request->filled('published_at') && !$validated['is_published']) {
            $this->authorize('publish', $post);
            $validated['published_at'] = $validated['published_at'];
        } elseif (!$validated['is_published']) {
            $validated['published_at'] = null;
        }

        // Manejar la imagen destacada
        if ($request->hasFile('featured_image')) {
            if ($post->featured_image) {
                $oldPath = Str::after($post->featured_image, '/storage/');
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('featured_image')
                ->store('posts/images', 'public');
            $validated['featured_image'] = Storage::disk('public')->url($path);
        }

        $post->update($validated);
        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        if ($post->featured_image) {
            $path = Str::after($post->featured_image, '/storage/');
            Storage::disk('public')->delete($path);
        }

        $post->delete();
        return response()->json(null, 204);
    }

    public function count()
    {
        $this->authorize('viewStats', Post::class);
        $totalPosts = Post::getTotalPosts();
        return response()->json(['total_posts' => $totalPosts]);
    }
}