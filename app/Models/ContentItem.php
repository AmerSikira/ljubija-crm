<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Dova/Hadis content item stored for daily guidance.
 */
class ContentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'description',
    ];
}
