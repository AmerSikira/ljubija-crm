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
        // Drop child table first to satisfy foreign key constraints.
        Schema::dropIfExists('messages');
        Schema::dropIfExists('message_topics');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: message tables intentionally removed.
    }
};
