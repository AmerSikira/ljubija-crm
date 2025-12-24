<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a person's assignment to a board with role metadata.
 */
class BoardMember extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
