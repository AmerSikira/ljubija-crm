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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description');
            $table->string('main_image')->nullable();
            $table->json('gallery')->nullable();
            $table->decimal('budget', 12, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('final_budget', 12, 2)->nullable();
            $table->string('completion_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
