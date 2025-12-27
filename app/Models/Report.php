<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Member;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'protocol_number',
        'meeting_datetime',
        'location',
        'recorder_id',
        'verifier_one_id',
        'verifier_two_id',
        'chairperson_id',
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
        'board_members' => 'array',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function recorder()
    {
        return $this->belongsTo(Member::class, 'recorder_id');
    }

    public function verifierOne()
    {
        return $this->belongsTo(Member::class, 'verifier_one_id');
    }

    public function verifierTwo()
    {
        return $this->belongsTo(Member::class, 'verifier_two_id');
    }

    public function chairperson()
    {
        return $this->belongsTo(Member::class, 'chairperson_id');
    }
}
