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
        Schema::create('memorials', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('status', ['preselio', 'nestao', 'logoras']);
            $table->date('birth_date')->nullable();
            $table->date('status_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->string('status_place')->nullable();
            $table->longText('short_info')->nullable();
            $table->longText('full_info')->nullable();
            $table->longText('family_info')->nullable();
            $table->boolean('published')->default(false);
            $table->string('main_image')->nullable();
            $table->json('gallery')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memorials');
    }
};
