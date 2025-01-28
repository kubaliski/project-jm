<?php

namespace App\Services;

use Exception;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Encoders\PngEncoder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    protected ImageManager $manager;

    protected array $defaultOptions = [
        'quality' => [
            'jpeg' => 80,
            'webp' => 85,
            'png' => 90
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

            // Determine original format
            $originalFormat = $this->determineOutputFormat($file->getMimeType());

            // Prepare result array
            $result = [
                'formats' => [],
                'metadata' => [
                    'original' => [
                        'width' => $image->width(),
                        'height' => $image->height(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'format' => $originalFormat
                    ]
                ]
            ];

            // Generate original versions
            $originalFormats = $this->generateOriginalVersions($image, $path, $filename, $originalFormat);
            $result['formats'] = array_merge($result['formats'], $originalFormats);

            // Generate versions for each configured size
            foreach ($this->defaultOptions['sizes'] as $size => $config) {
                if ($size === 'original') continue;

                $versions = $this->generateSizeVersions($image, $path, $filename, $size, $config, $originalFormat);
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
    protected function generateOriginalVersions($image, string $path, string $filename, string $originalFormat = 'jpg'): array
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

        // Save original version in original format
        $formats['original'] = $this->saveImage(
            $processedImage,
            $path,
            "{$filename}_original",
            $originalFormat,
            $this->defaultOptions['quality'][$originalFormat === 'jpg' ? 'jpeg' : $originalFormat]
        );

        // Save WebP version if original is not already WebP
        if ($originalFormat !== 'webp') {
            $formats['original_webp'] = $this->saveImage(
                $processedImage,
                $path,
                "{$filename}_original",
                'webp',
                $this->defaultOptions['quality']['webp']
            );
        }

        return $formats;
    }

    /**
     * Generate different size versions of the image
     */
    protected function generateSizeVersions($image, string $path, string $filename, string $size, array $config, string $originalFormat = 'jpg'): array
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

        // Save in original format
        $formats["{$size}"] = $this->saveImage(
            $processedImage,
            $path,
            "{$filename}_{$size}",
            $originalFormat,
            $this->defaultOptions['quality'][$originalFormat === 'jpg' ? 'jpeg' : $originalFormat]
        );

        // Save WebP version if original is not already WebP
        if ($originalFormat !== 'webp') {
            $formats["{$size}_webp"] = $this->saveImage(
                $processedImage,
                $path,
                "{$filename}_{$size}",
                'webp',
                $this->defaultOptions['quality']['webp']
            );
        }

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
            'png' => new PngEncoder($quality),
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
     * Determine output format based on input mime type
     */
    protected function determineOutputFormat(string $mimeType): string
    {
        return match($mimeType) {
            'image/png' => 'png',
            'image/jpeg', 'image/jpg' => 'jpg',
            'image/webp' => 'webp',
            default => 'jpg'
        };
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