<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'description',
        'amount',
        'paid_at',
        'created_by',
    ];

    protected $casts = [
        'paid_at' => 'date',
    ];

    protected function amount(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value / 100,
            set: fn ($value) => (int) round($value * 100)
        );
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
