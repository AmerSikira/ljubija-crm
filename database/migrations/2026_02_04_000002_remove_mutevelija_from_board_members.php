<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('board_members')->where('role', 'mutevelija')->delete();
    }

    public function down(): void
    {
        // no-op
    }
};
