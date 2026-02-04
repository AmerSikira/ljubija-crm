<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GraveSlot extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function reservations(): HasMany
    {
        return $this->hasMany(GraveReservation::class);
    }

    public function activeReservation(): HasOne
    {
        return $this->hasOne(GraveReservation::class)
            ->whereNull('removed_at')
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            });
    }
}
