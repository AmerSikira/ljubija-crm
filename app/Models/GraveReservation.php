<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GraveReservation extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'reserved_at' => 'datetime',
        'expires_at' => 'datetime',
        'removed_at' => 'datetime',
    ];

    public function slot(): BelongsTo
    {
        return $this->belongsTo(GraveSlot::class, 'grave_slot_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function removedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'removed_by_user_id');
    }
}
