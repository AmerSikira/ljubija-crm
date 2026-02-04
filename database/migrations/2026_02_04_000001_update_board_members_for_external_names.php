<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('board_members', function (Blueprint $table) {
            $table->dropForeign(['member_id']);
            $table->unsignedBigInteger('member_id')->nullable()->change();
            $table->string('external_name')->nullable()->after('member_id');
            $table->foreign('member_id')->references('id')->on('members')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('board_members', function (Blueprint $table) {
            $table->dropForeign(['member_id']);
            $table->dropColumn('external_name');
            $table->unsignedBigInteger('member_id')->nullable(false)->change();
            $table->foreign('member_id')->references('id')->on('members')->onDelete('cascade');
        });
    }
};
