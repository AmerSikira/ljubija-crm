<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payments extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentsFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'date_of_payment' => 'datetime',
        'paid_from' => 'datetime',
        'paid_to' => 'datetime',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class); // 🔑


    }


    protected function amount(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value / 100,          // DB → App (12345 → 123.45)
            set: fn ($value) => (int) round($value * 100) // App → DB (123.45 → 12345)
        );
    }
}
