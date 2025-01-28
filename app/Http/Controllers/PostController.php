<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use App\Http\Requests\Post\StoreRequest;
use App\Http\Requests\Post\UpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    public function __construct(protected PostService $postService)
    {
        $this->authorizeResource(Post::class, 'post');
    }

    /**
     * Display a listing of posts
     */
    public function index(): JsonResponse
    {
        $posts = Post::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    /**
     * Store a newly created post
     */
    public function store(StoreRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Validar la imagen si existe
            if ($request->hasFile('featured_image')) {
                $this->postService->validateImage($request->file('featured_image'));
            }

            // Procesar los datos del post
            $postData = $this->postService->processPostData(
                $request->validated(),
                $request->file('featured_image')
            );

            // Crear el post
            $post = $request->user()->posts()->create($postData);

            // Manejar el estado de publicación
            $publicationStatus = $this->postService->handlePublicationStatus($request->validated());
            if ($publicationStatus['is_published']) {
                $this->authorize('publish', $post);
            }
            $post->update($publicationStatus);

            DB::commit();
            return response()->json($post->load('user'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el post',
                'errors' => ['general' => $e->getMessage()]
            ], 422);
        }
    }

    /**
     * Display the specified post
     */
    public function show(Post $post): JsonResponse
    {
        return response()->json($post->load('user'));
    }

    /**
     * Update the specified post
     */
    public function update(UpdateRequest $request, Post $post): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Validar la imagen si existe
            if ($request->hasFile('featured_image')) {
                $this->postService->validateImage($request->file('featured_image'));
            }

            // Procesar los datos del post
            $postData = $this->postService->processPostData(
                $request->validated(),
                $request->file('featured_image'),
                $post->featured_image
            );

            // Manejar el estado de publicación
            $publicationStatus = $this->postService->handlePublicationStatus($request->validated());
            if ($publicationStatus['is_published'] && !$post->is_published) {
                $this->authorize('publish', $post);
            }

            // Actualizar el post
            $post->update([
                ...$postData,
                ...$publicationStatus
            ]);

            DB::commit();
            return response()->json($post->load('user'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar el post',
                'errors' => ['general' => $e->getMessage()]
            ], 422);
        }
    }

    /**
     * Remove the specified post
     */
    public function destroy(Post $post): JsonResponse
    {
        try {
            $post->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get published posts
     */
    public function published(): JsonResponse
    {
        $posts = Post::with('user')
            ->published()
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    /**
     * Get scheduled posts
     */
    public function scheduled(): JsonResponse
    {
        $this->authorize('viewAny', Post::class);

        $posts = Post::with('user')
            ->scheduled()
            ->orderBy('published_at', 'asc')
            ->get();

        return response()->json($posts);
    }

    /**
     * Get draft posts
     */
    public function drafts(): JsonResponse
    {
        $this->authorize('viewAny', Post::class);

        $posts = Post::with('user')
            ->where('is_published', false)
            ->whereNull('published_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    /**
     * Get post statistics
     */
    public function stats(): JsonResponse
    {
        $this->authorize('viewStats', Post::class);

        $stats = [
            'total' => Post::count(),
            'published' => Post::published()->count(),
            'scheduled' => Post::scheduled()->count(),
            'draft' => Post::where('is_published', false)
                ->whereNull('published_at')
                ->count(),
        ];

        return response()->json($stats);
    }
    // Va ser depreciado por stats , hay que actualizar la logica en el front
    public function count()
    {
        $this->authorize('viewStats', Post::class);
        $totalPosts = Post::getTotalPosts();
        return response()->json(['total_posts' => $totalPosts]);
    }
}