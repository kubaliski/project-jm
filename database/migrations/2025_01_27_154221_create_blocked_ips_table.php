<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blocked_ips', function (Blueprint $table): void {
            $table->id();
            $table->string('ip')->unique();
            $table->timestamp('blocked_at');
            $table->timestamp('expires_at');
            $table->timestamp('unblocked_at')->nullable();
            $table->timestamps();

            // Add indexes for better query performance
            $table->index(['ip', 'unblocked_at']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blocked_ips');
    }
};