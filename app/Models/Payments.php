<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Payments extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentsFactory> */
    use HasFactory;

    protected $guarded = [];

    public function member()
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
    
    protected function dateOfPayment(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => date('d.m.Y', strtotime($value)),
            set: fn ($value) => $value
        );
    }
}
