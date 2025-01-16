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
           'is_published' => 'required|boolean',
           'published_at' => 'nullable|date',
       ]);

       // Convertir is_published a booleano
       $validated['is_published'] = filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN);

       if ($request->hasFile('featured_image')) {
           $path = $request->file('featured_image')
               ->store('posts/images', 'public');
           $validated['featured_image'] = Storage::disk('public')->url($path);
       }

       // Crear el post primero para tener una instancia
       $post = $request->user()->posts()->create($validated);

       // Manejar la fecha de publicación
       if ($validated['is_published']) {
           // Si es publicación inmediata
           $this->authorize('publish', $post);
           $post->published_at = now();
       } elseif ($request->filled('published_at')) {
           // Si es publicación programada
           $this->authorize('publish', $post);
           $post->published_at = $request->input('published_at');
       } else {
           // Si no es publicación ni programada
           $post->published_at = null;
       }

       $post->save();
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
                'featured_image' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif|max:10240',
                'seo_title' => 'nullable|string|max:255',
                'seo_description' => 'nullable|string',
                'is_published' => 'required|boolean',
                'published_at' => 'nullable|date',
        ]);

       // Convertir is_published a booleano
       $validated['is_published'] = filter_var($request->input('is_published'), FILTER_VALIDATE_BOOLEAN);

       // Manejar la fecha de publicación
       if ($validated['is_published'] && !$post->published_at) {
           $this->authorize('publish', $post);
           $validated['published_at'] = now();
       } elseif ($request->filled('published_at') && !$validated['is_published']) {
           $this->authorize('publish', $post);
           $validated['published_at'] = $request->input('published_at');
       } elseif (!$validated['is_published'] && !$request->filled('published_at')) {
           $validated['published_at'] = null;
       }

       // Manejar la imagen destacada
       if ($request->hasFile('featured_image')) {
           // Si existe una imagen anterior, eliminarla
           if ($post->featured_image) {
               $oldPath = Str::after($post->featured_image, '/storage/');
               Storage::disk('public')->delete($oldPath);
           }

           // Guardar la nueva imagen
           $path = $request->file('featured_image')
               ->store('posts/images', 'public');
           $validated['featured_image'] = Storage::disk('public')->url($path);
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