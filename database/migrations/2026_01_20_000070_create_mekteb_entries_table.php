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
        Schema::create('mekteb_entries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('short_description')->nullable();
            $table->longText('full_description')->nullable();
            $table->string('main_image')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('published')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mekteb_entries');
    }
};
