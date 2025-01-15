<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('contacts', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        $table->string('email');
        $table->string('phone')->nullable();
        $table->string('subject');
        $table->text('message');
        $table->enum('status', [
            'pending',      // No se ha respondido
            'in_progress',  // En tramitación
            'completed',    // Finalizado
            'spam'         // No interesa/spam
        ])->default('pending');
        $table->text('observations')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
