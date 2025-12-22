<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class MektebEntry extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $guarded = [];

    protected $casts = [
        'published' => 'boolean',
        'gallery' => 'array',
    ];

    protected $appends = ['main_image_url', 'gallery_urls'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('main_image')->singleFile();
        $this->addMediaCollection('gallery');
    }

    public function getMainImageUrlAttribute(): ?string
    {
        $mediaUrl = $this->getFirstMediaUrl('main_image');
        return $mediaUrl ?: $this->main_image;
    }

    public function getGalleryUrlsAttribute(): array
    {
        $urls = $this->getMedia('gallery')->map->getUrl()->values()->all();
        return !empty($urls) ? $urls : ($this->gallery ?? []);
    }
}
