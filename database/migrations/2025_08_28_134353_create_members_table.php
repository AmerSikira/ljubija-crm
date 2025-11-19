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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->json('family_members')->nullable();
            $table->string('email_abroad')->nullable();
            $table->string('phone_abroad')->nullable();
            $table->string('address_abroad')->nullable();
            $table->string('city_abroad')->nullable();
            $table->string('country')->nullable();
             $table->foreignId('user_id')->constrained()->onDelete('cascade'); // 🔑
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
