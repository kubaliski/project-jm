<?php

namespace App\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

class PublishScheduledPosts extends Command
{
    protected $signature = 'posts:publish-scheduled';
    protected $description = 'Publish scheduled posts that have reached their publication date';

    public function __invoke(): void
    {
        $this->info('Starting to publish scheduled posts...');

        try {
            $posts = Post::readyToPublish()->get();
            $publishedCount = 0;

            foreach ($posts as $post) {
                $post->update([
                    'is_published' => true
                ]);
                $this->info("Published post: {$post->title}");
                $publishedCount++;
            }

            $this->info("Successfully published {$publishedCount} posts.");
        } catch (\Exception $e) {
            $this->error("Error publishing scheduled posts: {$e->getMessage()}");
            report($e);
        }
    }
}