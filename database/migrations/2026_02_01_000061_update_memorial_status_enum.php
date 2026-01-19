<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('memorials')) {
            return;
        }

        $driver = DB::getDriverName();

        // MySQL syntax; SQLite is handled with table rebuild below.
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE memorials MODIFY status ENUM('preselio','nestao','logoras','nema_statusa') NOT NULL DEFAULT 'nema_statusa'");
            DB::table('memorials')->update(['status' => 'nema_statusa']);
            return;
        }

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys=OFF;');

            Schema::create('memorials_tmp', function ($table) {
                $table->id();
                $table->string('first_name');
                $table->string('last_name');
                $table->string('status')->default('nema_statusa'); // allow new status in SQLite
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

            DB::statement("
                INSERT INTO memorials_tmp (id, first_name, last_name, status, birth_date, status_date, birth_place, status_place, short_info, full_info, family_info, published, main_image, gallery, created_at, updated_at)
                SELECT id, first_name, last_name, 'nema_statusa' as status, birth_date, status_date, birth_place, status_place, short_info, full_info, family_info, published, main_image, gallery, created_at, updated_at
                FROM memorials
            ");

            Schema::drop('memorials');
            Schema::rename('memorials_tmp', 'memorials');
            DB::statement('PRAGMA foreign_keys=ON;');
            return;
        }

        // Fallback for other drivers: attempt direct update without altering the column.
        DB::table('memorials')->update(['status' => 'nema_statusa']);
    }

    public function down(): void
    {
        if (!Schema::hasTable('memorials')) {
            return;
        }

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE memorials MODIFY status ENUM('preselio','nestao','logoras') NOT NULL DEFAULT 'preselio'");
        }
        // For SQLite/others, we leave the flexible string column as-is in down().
    }
};
