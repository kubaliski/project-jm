<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
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

   public function store(Request $request)
   {
       $validated = $request->validate([
           'title' => 'required|string|max:255',
           'content' => 'required|string',
           'excerpt' => 'nullable|string',
           'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
           'seo_title' => 'nullable|string|max:255',
           'seo_description' => 'nullable|string',
           'is_published' => 'boolean',
           'published_at' => 'nullable|date',
       ]);

       $validated['is_published'] = filter_var($validated['is_published'], FILTER_VALIDATE_BOOLEAN);

       if ($request->hasFile('featured_image')) {
           $path = $request->file('featured_image')
               ->store('posts/images', 'public');
           $validated['featured_image'] = Storage::disk('public')->url($path);
       }

       if ($validated['is_published']) {
           // Verificar permiso de publicación
           $this->authorize('publish', Post::class);
           $validated['published_at'] = now();
       }

       $post = $request->user()->posts()->create($validated);

       return response()->json($post, 201);
   }

   public function show(Post $post)
   {
       return response()->json($post->load('user'));
   }

   public function update(Request $request, Post $post)
   {
       $validated = $request->validate([
           'title' => 'required|string|max:255',
           'content' => 'required|string',
           'excerpt' => 'nullable|string',
           'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
           'seo_title' => 'nullable|string|max:255',
           'seo_description' => 'nullable|string',
           'is_published' => 'boolean',
           'published_at' => 'nullable|date',
       ]);

       if ($request->hasFile('featured_image')) {
           if ($post->featured_image) {
               $oldPath = Str::after($post->featured_image, '/storage/');
               Storage::disk('public')->delete($oldPath);
           }

           $path = $request->file('featured_image')
               ->store('posts/images', 'public');
           $validated['featured_image'] = Storage::disk('public')->url($path);
       }

       // Verificar permiso de publicación si se está cambiando el estado
       if ($validated['is_published'] && !$post->published_at) {
           $this->authorize('publish', $post);
           $validated['published_at'] = now();
       }

       $post->update($validated);

       return response()->json($post);
   }

   public function destroy(Post $post)
   {
       // Eliminar imagen si existe
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