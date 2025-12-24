<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * Project with media, budget fields, and related interests.
 */
class Project extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $guarded = [];

    protected $casts = [
        'gallery' => 'array',
        'budget' => 'float',
        'final_budget' => 'float',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = ['main_image_url', 'gallery_urls'];

    public function interests(): HasMany
    {
        return $this->hasMany(ProjectInterest::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('main_image')->singleFile();
        $this->addMediaCollection('gallery');
    }

    public function getMainImageUrlAttribute(): ?string
    {
        $mediaUrl = $this->getFirstMediaUrl('main_image');
        if ($mediaUrl) {
            return $mediaUrl;
        }

        return $this->main_image ?: null;
    }

    public function getGalleryUrlsAttribute(): array
    {
        $media = $this->getMedia('gallery')->map->getUrl()->toArray();
        if (!empty($media)) {
            return $media;
        }

        return $this->gallery ?? [];
    }
}
