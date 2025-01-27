<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_attempts', function (Blueprint $table): void {
            $table->id();
            $table->string('ip');
            $table->string('attempt_type');
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('ip');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('access_attempts');
    }
};