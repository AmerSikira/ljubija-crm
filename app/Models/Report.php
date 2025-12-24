<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'protocol_number',
        'meeting_datetime',
        'location',
        'recorder',
        'verifier_one',
        'verifier_two',
        'chairperson',
        'board_members',
        'attendees_count',
        'quorum_note',
        'agenda',
        'digital_votes',
        'urgent_consultations',
        'discussion',
        'decisions',
        'ended_at',
        'attendance_notes',
        'created_by',
    ];

    protected $casts = [
        'meeting_datetime' => 'datetime',
        'agenda' => 'array',
        'decisions' => 'array',
        'ended_at' => 'datetime:H:i',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
