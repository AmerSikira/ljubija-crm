<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    public const STATUS_UPIT = 'upit';
    public const STATUS_ODGOVORENO = 'odgovoreno';
    public const STATUS_ZATVORENO = 'zatvoreno';

    protected $fillable = [
        'user_id',
        'subject',
        'status',
        'admin_unread',
        'user_unread',
        'last_activity_at',
    ];

    protected $casts = [
        'admin_unread' => 'boolean',
        'user_unread' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TicketMessage::class)->orderBy('created_at');
    }

    public function touchActivity(): void
    {
        $this->update(['last_activity_at' => now()]);
    }

    public function markReadByAdmin(): void
    {
        $this->forceFill(['admin_unread' => false])->save();
    }

    public function markReadByUser(): void
    {
        $this->forceFill(['user_unread' => false])->save();
    }
}
