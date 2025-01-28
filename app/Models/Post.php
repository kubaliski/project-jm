<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'seo_title',
        'seo_description',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'featured_image' => 'array'
    ];

    /**
     * Get the user that owns the post
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            // Generar slug si no existe
            if (!$post->slug) {
                $post->slug = Str::slug($post->title);
            }
            // Generar excerpt si no existe y hay contenido
            if (!$post->excerpt && $post->content) {
                $post->excerpt = str()->words(strip_tags($post->content), 50);
            }
        });

        static::updating(function ($post) {
            // Actualizar slug si el título cambió
            if ($post->isDirty('title')) {
                $post->slug = Str::slug($post->title);
            }
        });

        // Limpiar imágenes al eliminar el post
        static::deleting(function ($post) {
            if ($post->featured_image) {
                foreach ($post->featured_image['formats'] ?? [] as $path) {
                    Storage::disk('public')->delete($path);
                }
            }
        });
    }

    /**
     * Get the featured image URL for a specific version and format
     */
    public function getFeaturedImageUrl(string $version = 'original', string $format = 'original'): ?string
    {
        if (!$this->featured_image) {
            return null;
        }

        $key = $format === 'webp' ? "{$version}_webp" : $version;
        $path = $this->featured_image['formats'][$key] ?? $this->featured_image['formats']['original'] ?? null;

        return $path ? Storage::disk('public')->url($path) : null;
    }

    /**
     * Get featured image metadata
     */
    public function getFeaturedImageMetadata(): ?array
    {
        return $this->featured_image['metadata'] ?? null;
    }

    /**
     * Get all image URLs with their variations
     */
    public function getAllFeaturedImageUrls(): array
    {
        if (!$this->featured_image) {
            return [];
        }

        $result = [];
        foreach ($this->featured_image['formats'] as $version => $path) {
            $result[$version] = Storage::disk('public')->url($path);
        }

        return $result;
    }

    /**
     * Get featured image srcset for responsive images
     */
    public function getFeaturedImageSrcset(string $format = 'original'): string
    {
        if (!$this->featured_image) {
            return '';
        }

        $srcset = [];
        $sizes = [
            'card' => '600w',
            'featured' => '1200w',
            'original' => '2048w'
        ];

        foreach ($sizes as $size => $width) {
            $key = $format === 'webp' ? "{$size}_webp" : $size;
            if (isset($this->featured_image['formats'][$key])) {
                $url = Storage::disk('public')->url($this->featured_image['formats'][$key]);
                $srcset[] = "{$url} {$width}";
            }
        }

        return implode(', ', $srcset);
    }

    /**
     * Get total number of posts
     */
    public static function getTotalPosts(): int
    {
        return static::count();
    }

    /**
     * Scope a query to only include published posts
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where(function($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }

    /**
     * Scope a query to only include scheduled posts
     */
    public function scopeScheduled($query)
    {
        return $query->where('is_published', false)
            ->whereNotNull('published_at')
            ->where('published_at', '>', now());
    }

    /**
     * Scope a query to only include posts ready to publish
     */
    public function scopeReadyToPublish($query)
    {
        return $query->where('is_published', false)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Check if post is scheduled
     */
    public function isScheduled(): bool
    {
        return !$this->is_published
            && $this->published_at
            && $this->published_at->isFuture();
    }

    /**
     * Check if post is ready to publish
     */
    public function isReadyToPublish(): bool
    {
        return !$this->is_published
            && $this->published_at
            && !$this->published_at->isFuture();
    }

    /**
     * Get the post status
     */
    public function getStatus(): string
    {
        if ($this->is_published) {
            return 'published';
        }

        if ($this->isScheduled()) {
            return 'scheduled';
        }

        if ($this->isReadyToPublish()) {
            return 'ready';
        }

        return 'draft';
    }

    /**
     * Check if post has featured image
     */
    public function hasFeaturedImage(): bool
    {
        return !empty($this->featured_image['formats']);
    }

    /**
     * Get formatted date for displaying
     */
    public function getFormattedDate(string $field = 'published_at'): ?string
    {
        if (!$this->{$field}) {
            return null;
        }

        return $this->{$field}->format('Y-m-d H:i:s');
    }
}