<?php

namespace App\Http\Controllers;

use App\Models\MektebEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Handles mekteb entries (news-like posts) with media and publish state.
 */
class MektebController extends Controller
{
    /**
     * List entries for public/admin; admins see unpublished.
     */
    public function index(Request $request)
    {
        $query = MektebEntry::query()->orderByDesc('created_at');
        $isAdmin = $this->isAdmin($request);

        if (!$isAdmin) {
            $query->where('published', true);
        }

        $entries = $query
            ->get()
            ->map(fn (MektebEntry $entry) => $this->transformEntry($entry, true));

        return Inertia::render('mekteb/index', [
            'entries' => $entries,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function show(Request $request, MektebEntry $mekteb)
    {
        $isAdmin = $this->isAdmin($request);
        if (!$mekteb->published && !$isAdmin) {
            abort(404);
        }

        return Inertia::render('mekteb/show', [
            'entry' => $this->transformEntry($mekteb, false, true),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeAdmin($request);

        return Inertia::render('mekteb/create');
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);

        $entry = MektebEntry::create($data);
        $this->handleMedia($entry, $request);

        return redirect()->route('mekteb.index')->with('success', 'Objava je dodana.');
    }

    public function edit(Request $request, MektebEntry $mekteb)
    {
        $this->authorizeAdmin($request);

        return Inertia::render('mekteb/edit', [
            'entry' => $this->transformEntry($mekteb, false, true, true),
        ]);
    }

    public function update(Request $request, MektebEntry $mekteb)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);
        $mekteb->update($data);

        if ($request->filled('removed_media_ids')) {
            $ids = array_filter($request->input('removed_media_ids', []), 'is_numeric');
            $mekteb->media()->whereIn('id', $ids)->get()->each->delete();
        }

        $this->handleMedia($mekteb, $request);

        return redirect()->route('mekteb.index')->with('success', 'Objava je ažurirana.');
    }

    public function destroy(Request $request, MektebEntry $mekteb)
    {
        $this->authorizeAdmin($request);
        $mekteb->delete();

        return redirect()->route('mekteb.index')->with('success', 'Objava je obrisana.');
    }

    private function authorizeAdmin(Request $request): void
    {
        if (!$this->isAdmin($request)) {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    private function isAdmin(Request $request): bool
    {
        return $request->user()?->role === 'admin';
    }

    private function validateData(Request $request): array
    {
        return $request->validate(
            [
                'title' => 'required|string|max:255',
                'short_description' => 'required|string',
                'full_description' => 'required|string',
                'published' => 'boolean',
                'main_image' => 'nullable|image|max:4096',
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|image|max:4096',
                'removed_media_ids' => 'array',
                'removed_media_ids.*' => 'integer',
            ],
            [
                'title.required' => 'Naslov je obavezan.',
                'short_description.required' => 'Kratki opis je obavezan.',
                'full_description.required' => 'Puni opis je obavezan.',
            ]
        );
    }

    private function handleMedia(MektebEntry $entry, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $entry->clearMediaCollection('main_image');
            $media = $entry->addMediaFromRequest('main_image')->toMediaCollection('main_image');
            $entry->update(['main_image' => $media->getUrl()]);
        }

        if ($request->hasFile('gallery')) {
            $entry->clearMediaCollection('gallery');
            $urls = [];
            foreach ($request->file('gallery') as $file) {
                $media = $entry->addMedia($file)->toMediaCollection('gallery');
                $urls[] = $media->getUrl();
            }
            $entry->update(['gallery' => $urls]);
        }
    }

    private function transformEntry(MektebEntry $entry, bool $withPreview = false, bool $includeGallery = false, bool $withMediaIds = false): array
    {
        $entry->loadMissing('media');

        return [
            'id' => $entry->id,
            'title' => $entry->title,
            'short_description' => $withPreview ? Str::limit($entry->short_description, 200, '...') : $entry->short_description,
            'full_description' => $entry->full_description,
            'published' => $entry->published,
            'main_image_url' => $entry->main_image_url,
            'gallery_urls' => $includeGallery ? $entry->gallery_urls : [],
            'gallery' => $withMediaIds
                ? $entry->getMedia('gallery')->map(fn ($m) => ['id' => $m->id, 'url' => $m->getUrl()])
                : [],
            'created_at' => $entry->created_at?->format('d.m.Y'),
        ];
    }
}
