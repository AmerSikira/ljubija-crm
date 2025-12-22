<?php

namespace App\Http\Controllers;

use App\Models\Memorial;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MemorialController extends Controller
{
    private array $statusLabels = [
        'preselio' => 'Preselio',
        'nestao' => 'Nestao',
    ];

    public function index(Request $request)
    {
        $query = Memorial::query()->orderByDesc('status_date')->orderBy('last_name');

        if (!$this->isAdmin($request)) {
            $query->where('published', true);
        }

        $memorials = $query
            ->get()
            ->map(fn (Memorial $memorial) => $this->transformMemorial($memorial, true));

        return Inertia::render('memorials/index', [
            'memorials' => $memorials,
        ]);
    }

    public function show(Request $request, Memorial $memorial)
    {
        if (!$memorial->published && !$this->isAdmin($request)) {
            abort(404);
        }

        return Inertia::render('memorials/show', [
            'memorial' => $this->transformMemorial($memorial, false, true),
            'isAdmin' => $this->isAdmin($request),
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeAdmin($request);

        return Inertia::render('memorials/create');
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);

        $memorial = Memorial::create($data);
        $this->handleMedia($memorial, $request);

        return redirect()->route('memorials.index')->with('success', 'Osoba je dodana.');
    }

    public function edit(Request $request, Memorial $memorial)
    {
        $this->authorizeAdmin($request);
        return Inertia::render('memorials/edit', [
            'memorial' => $this->transformMemorial($memorial, false, true),
        ]);
    }

    public function update(Request $request, Memorial $memorial)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);
        $memorial->update($data);
        $this->handleMedia($memorial, $request);

        return redirect()->route('memorials.index')->with('success', 'Osoba je ažurirana.');
    }

    public function destroy(Request $request, Memorial $memorial)
    {
        $this->authorizeAdmin($request);
        $memorial->delete();

        return redirect()->route('memorials.index')->with('success', 'Osoba je obrisana.');
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
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'status' => 'required|in:preselio,nestao',
                'birth_date' => 'nullable|date',
                'status_date' => 'nullable|date',
                'birth_place' => 'nullable|string|max:255',
                'status_place' => 'nullable|string|max:255',
                'short_info' => 'nullable|string',
                'full_info' => 'nullable|string',
                'family_info' => 'nullable|string',
                'published' => 'boolean',
                'main_image' => 'nullable|image|max:4096',
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|image|max:4096',
            ],
            [
                'first_name.required' => 'Ime je obavezno.',
                'last_name.required' => 'Prezime je obavezno.',
                'status.required' => 'Status je obavezan.',
            ]
        );
    }

    private function handleMedia(Memorial $memorial, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $memorial->clearMediaCollection('main_image');
            $media = $memorial->addMediaFromRequest('main_image')->toMediaCollection('main_image');
            $memorial->update(['main_image' => $media->getUrl()]);
        }

        if ($request->hasFile('gallery')) {
            $memorial->clearMediaCollection('gallery');
            $urls = [];
            foreach ($request->file('gallery') as $file) {
                $media = $memorial->addMedia($file)->toMediaCollection('gallery');
                $urls[] = $media->getUrl();
            }
            $memorial->update(['gallery' => $urls]);
        }
    }

    private function transformMemorial(Memorial $memorial, bool $withPreview = false, bool $includeMedia = false): array
    {
        $memorial->loadMissing('media');

        return [
            'id' => $memorial->id,
            'first_name' => $memorial->first_name,
            'last_name' => $memorial->last_name,
            'full_name' => trim($memorial->first_name . ' ' . $memorial->last_name),
            'status' => $memorial->status,
            'status_label' => $this->statusLabels[$memorial->status] ?? $memorial->status,
            'birth_date' => optional($memorial->birth_date)?->format('d.m.Y'),
            'status_date' => optional($memorial->status_date)?->format('d.m.Y'),
            'birth_place' => $memorial->birth_place,
            'status_place' => $memorial->status_place,
            'short_info' => $memorial->short_info,
            'short_info_preview' => $withPreview ? Str::limit($memorial->short_info, 140, '...') : $memorial->short_info,
            'full_info' => $memorial->full_info,
            'family_info' => $memorial->family_info,
            'published' => $memorial->published,
            'main_image_url' => $memorial->main_image_url,
            'gallery_urls' => $includeMedia ? $memorial->gallery_urls : [],
        ];
    }
}
