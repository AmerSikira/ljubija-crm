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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('protocol_number');
            $table->dateTime('meeting_datetime');
            $table->string('location')->nullable();

            $table->foreignId('recorder_id')->nullable()->constrained('members')->nullOnDelete();
            $table->foreignId('verifier_one_id')->nullable()->constrained('members')->nullOnDelete();
            $table->foreignId('verifier_two_id')->nullable()->constrained('members')->nullOnDelete();
            $table->foreignId('chairperson_id')->nullable()->constrained('members')->nullOnDelete();
            $table->json('board_members')->nullable();
            $table->unsignedInteger('attendees_count')->nullable();
            $table->string('quorum_note')->nullable();

            $table->json('agenda')->nullable();
            $table->text('digital_votes')->nullable();
            $table->text('urgent_consultations')->nullable();
            $table->longText('discussion')->nullable();
            $table->json('decisions')->nullable();

            $table->time('ended_at')->nullable();
            $table->text('attendance_notes')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
