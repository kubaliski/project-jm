<?php

namespace App\Services;

use Illuminate\Support\Str;

class PostService
{
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

    protected function generateExcerpt(string $content, ?string $excerpt = null): string
    {
        if (!empty($excerpt)) {
            return $excerpt;
        }

        return Str::limit(strip_tags($content), 160);
    }

    protected function generateSeoTitle(string $title, ?string $seoTitle = null): string
    {
        if (!empty($seoTitle)) {
            return $seoTitle;
        }

        return Str::limit($title, 60);
    }

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
}
