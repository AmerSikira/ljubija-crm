<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Records a user's vote for a poll item.
 */
class PollVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'poll_id',
        'poll_item_id',
        'user_id',
    ];

    protected static function booted(): void
    {
        static::created(function (PollVote $vote) {
            $vote->item?->increment('votes_count');
        });

        static::deleted(function (PollVote $vote) {
            if ($vote->item && $vote->item->votes_count > 0) {
                $vote->item->decrement('votes_count');
            }
        });
    }

    public function poll(): BelongsTo
    {
        return $this->belongsTo(Poll::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(PollItem::class, 'poll_item_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
