<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grave_reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grave_slot_id')->constrained('grave_slots')->cascadeOnDelete();
            $table->timestamp('reserved_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('removed_at')->nullable();
            $table->foreignId('removed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('remove_reason')->nullable();
            $table->timestamps();

            $table->index(['grave_slot_id', 'removed_at', 'expires_at']);
            $table->index(['user_id', 'removed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grave_reservations');
    }
};
