<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('app_infos', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('legal_representative');
            $table->text('address');
            $table->string('contact_email');
            $table->string('phone_1');
            $table->string('phone_2')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('app_infos');
    }
};