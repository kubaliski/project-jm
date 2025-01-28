<?php

namespace App\Services;

use Exception;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Encoders\JpegEncoder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class ImageService
{
    protected ImageManager $manager;

    protected array $defaultOptions = [
        'quality' => [
            'jpeg' => 80,
            'webp' => 85
        ],
        'sizes' => [
            'thumbnail' => [
                'width' => 128,
                'height' => 128,
                'mode' => 'fit'
            ],
            'card' => [
                'width' => 600,
                'height' => 192,
                'mode' => 'crop'
            ],
            'featured' => [
                'width' => 1200,
                'height' => 400,
                'mode' => 'crop'
            ],
            'original' => [
                'maxWidth' => 2048,
                'quality' => 90
            ]
        ]
    ];

    public function __construct(
        protected string $disk = 'public',
        protected array $supportedFormats = ['jpg', 'jpeg', 'png', 'webp']
    ) {
        if (!extension_loaded('gd')) {
            throw new Exception('GD library is not installed');
        }

        $this->manager = new ImageManager(
            new Driver()
        );
    }

    /**
     * Handle the upload and processing of a featured image
     */
    public function handleFeaturedImage(
        ?UploadedFile $file,
        ?array $currentImage = null,
        string $path = 'posts/images'
    ): ?array {
        if (!$file && !$currentImage) {
            return null;
        }

        if (!$file && $currentImage) {
            return $currentImage;
        }

        try {
            // Delete previous images if they exist
            if ($currentImage) {
                $this->deleteImages($currentImage);
            }

            // Generate base filename
            $filename = Str::uuid();

            // Create image instance
            $image = $this->manager->read($file);

            // Prepare result array
            $result = [
                'formats' => [],
                'metadata' => [
                    'original' => [
                        'width' => $image->width(),
                        'height' => $image->height(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ]
                ]
            ];

            // Generate original versions
            $originalFormats = $this->generateOriginalVersions($image, $path, $filename);
            $result['formats'] = array_merge($result['formats'], $originalFormats);

            // Generate versions for each configured size
            foreach ($this->defaultOptions['sizes'] as $size => $config) {
                if ($size === 'original') continue;

                $versions = $this->generateSizeVersions($image, $path, $filename, $size, $config);
                $result['formats'] = array_merge($result['formats'], $versions);
            }

            return $result;

        } catch (Exception $e) {
            \Log::error('Error processing image: ' . $e->getMessage());
            throw new Exception('Error processing image: ' . $e->getMessage());
        }
    }

    /**
     * Generate original and WebP versions of the image
     */
    protected function generateOriginalVersions($image, string $path, string $filename): array
    {
        $formats = [];
        $config = $this->defaultOptions['sizes']['original'];

        // Clone the image for processing
        $processedImage = clone $image;

        // Resize original if needed
        if ($processedImage->width() > $config['maxWidth']) {
            $processedImage->resize($config['maxWidth'], null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->preventUpsize();
            });
        }

        // Save original version
        $formats['original'] = $this->saveImage(
            $processedImage,
            $path,
            "{$filename}_original",
            'jpg',
            $config['quality']
        );

        // Save WebP version
        $formats['original_webp'] = $this->saveImage(
            $processedImage,
            $path,
            "{$filename}_original",
            'webp',
            $this->defaultOptions['quality']['webp']
        );

        return $formats;
    }

    /**
     * Generate different size versions of the image
     */
    protected function generateSizeVersions($image, string $path, string $filename, string $size, array $config): array
    {
        $formats = [];
        $processedImage = clone $image;

        // Apply resizing based on mode
        if ($config['mode'] === 'crop') {
            $processedImage->cover($config['width'], $config['height']);
        } else {
            $processedImage->resize($config['width'], $config['height'], function ($constraint) {
                $constraint->aspectRatio();
                $constraint->preventUpsize();
            });
        }

        // Save in original format (JPG)
        $formats["{$size}"] = $this->saveImage(
            $processedImage,
            $path,
            "{$filename}_{$size}",
            'jpg',
            $this->defaultOptions['quality']['jpeg']
        );

        // Save WebP version
        $formats["{$size}_webp"] = $this->saveImage(
            $processedImage,
            $path,
            "{$filename}_{$size}",
            'webp',
            $this->defaultOptions['quality']['webp']
        );

        return $formats;
    }

    /**
     * Save image to storage
     */
    protected function saveImage($image, string $path, string $filename, string $format, int $quality): string
    {
        $fullPath = "{$path}/{$filename}.{$format}";

        // Seleccionar el encoder correcto según el formato
        $encoder = match($format) {
            'webp' => new WebpEncoder($quality),
            'jpg', 'jpeg' => new JpegEncoder($quality),
            default => throw new Exception("Formato no soportado: {$format}")
        };

        Storage::disk($this->disk)->put(
            $fullPath,
            $image->encode($encoder)->toString()
        );

        return $fullPath;
    }

    /**
     * Delete all versions of an image
     */
    protected function deleteImages(?array $images): void
    {
        if (!$images || !isset($images['formats'])) return;

        foreach ($images['formats'] as $path) {
            if (Storage::disk($this->disk)->exists($path)) {
                Storage::disk($this->disk)->delete($path);
            }
        }
    }

    /**
     * Validate image dimensions
     */
    public function validateDimensions(UploadedFile $file, int $minWidth = 200, int $minHeight = 200): bool
    {
        try {
            $image = $this->manager->read($file);
            return $image->width() >= $minWidth && $image->height() >= $minHeight;
        } catch (Exception $e) {
            return false;
        }
    }
}