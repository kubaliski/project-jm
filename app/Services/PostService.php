<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class PostService
{
    public function __construct(protected ImageService $imageService)
    {}

    /**
     * Handle the complete post data processing
     */
    public function processPostData(array $data, ?UploadedFile $image = null, ?array $currentImage = null): array
    {
        $processed = $this->generateMetadata($data);

        if ($image) {
            $processed['featured_image'] = $this->handlePostImage($image, $currentImage);
        }

        return $processed;
    }

    /**
     * Generate metadata for a post
     */
    public function generateMetadata(array $data): array
    {
        return [
            'excerpt' => $this->generateExcerpt($data['content'], $data['excerpt'] ?? null),
            'seo_title' => $this->generateSeoTitle($data['title'], $data['seo_title'] ?? null),
            'seo_description' => $this->generateSeoDescription(
                $data['content'],
                $data['excerpt'] ?? null,
                $data['seo_description'] ?? null
            ),
        ];
    }

    /**
     * Handle post image processing
     */
    public function handlePostImage(?UploadedFile $file, ?array $currentImage = null): ?array
    {
        if (!$file && !$currentImage) {
            return null;
        }

        try {
            return $this->imageService->handleFeaturedImage($file, $currentImage);
        } catch (\Exception $e) {
            \Log::error('Error processing post image: ' . $e->getMessage());
            throw new \Exception('Error al procesar la imagen: ' . $e->getMessage());
        }
    }

    /**
     * Generate excerpt from content
     */
    protected function generateExcerpt(string $content, ?string $excerpt = null): string
    {
        if (!empty($excerpt)) {
            return $excerpt;
        }

        return Str::limit(strip_tags($content), 160);
    }

    /**
     * Generate SEO title
     */
    protected function generateSeoTitle(string $title, ?string $seoTitle = null): string
    {
        if (!empty($seoTitle)) {
            return $seoTitle;
        }

        return Str::limit($title, 60);
    }

    /**
     * Generate SEO description
     */
    protected function generateSeoDescription(
        string $content,
        ?string $excerpt = null,
        ?string $seoDescription = null
    ): string {
        if (!empty($seoDescription)) {
            return $seoDescription;
        }

        return $this->generateExcerpt($content, $excerpt);
    }

    /**
     * Handle publication status and date
     */
    public function handlePublicationStatus(array $data): array
    {
        $status = [
            'is_published' => $data['is_published'] ?? false,
            'published_at' => null
        ];

        if ($status['is_published']) {
            $status['published_at'] = $data['published_at'] ?? now();
        } elseif (!empty($data['published_at'])) {
            $status['published_at'] = $data['published_at'];
        }

        return $status;
    }

    /**
     * Validate image file
     */
    public function validateImage(?UploadedFile $file): bool
    {
        if (!$file) {
            return true;
        }

        $maxSize = 10 * 1024 * 1024; // 10MB
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if ($file->getSize() > $maxSize) {
            throw new \Exception('La imagen no debe superar los 10MB');
        }

        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \Exception('El archivo debe ser una imagen válida (JPEG, PNG, GIF o WebP)');
        }

        return true;
    }
}