<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grave_slots', function (Blueprint $table) {
            $table->id();
            $table->char('letter', 1);
            $table->unsignedSmallInteger('number');
            $table->timestamps();

            $table->unique(['letter', 'number']);
            $table->index(['letter', 'number']);
        });

        $rows = [];
        foreach (range('A', 'Z') as $letter) {
            for ($number = 1; $number <= 100; $number++) {
                $rows[] = [
                    'letter' => $letter,
                    'number' => $number,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                if (count($rows) >= 500) {
                    DB::table('grave_slots')->insert($rows);
                    $rows = [];
                }
            }
        }
        if ($rows) {
            DB::table('grave_slots')->insert($rows);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('grave_slots');
    }
};
