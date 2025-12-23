<?php

namespace App\Http\Controllers;

use App\Models\DzematPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DzematPageController extends Controller
{
    public function show()
    {
        $page = DzematPage::with('media')->first();

        return Inertia::render('dzemat/index', [
            'page' => $page ? $this->transform($page) : null,
        ]);
    }

    public function edit(Request $request)
    {
        $this->authorizeAdmin($request);
        $page = DzematPage::with('media')->first();

        return Inertia::render('dzemat/edit', [
            'page' => $page ? $this->transform($page, true) : null,
        ]);
    }

    public function update(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'gallery' => 'array',
            'gallery.*' => 'string',
            'gallery_uploads' => 'array',
            'gallery_uploads.*' => 'image|max:4096',
            'removed_media_ids' => 'array',
            'removed_media_ids.*' => 'integer',
        ]);

        $page = DzematPage::with('media')->first() ?? new DzematPage();
        $page->title = $data['title'];
        $page->content = $data['content'];
        $page->gallery = $data['gallery'] ?? [];
        $page->save();

        if (!empty($data['removed_media_ids'])) {
            $page->media()->whereIn('id', $data['removed_media_ids'])->get()->each->delete();
        }

        if ($request->hasFile('gallery_uploads')) {
            foreach ($request->file('gallery_uploads') as $file) {
                $page->addMedia($file)->toMediaCollection('gallery');
            }
        }

        return redirect()->route('dzemat.show')->with('success', 'Podaci su sačuvani.');
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    private function transform(DzematPage $page, bool $forEdit = false): array
    {
        return [
            'id' => $page->id,
            'title' => $page->title,
            'content' => $page->content,
            'gallery' => $forEdit
                ? $page->getMedia('gallery')->map(fn ($m) => ['id' => $m->id, 'url' => $m->getUrl()])->values()->all()
                : [],
            'gallery_urls' => $page->getMedia('gallery')->map->getUrl()->values()->all(),
            'updated_at' => $page->updated_at?->toDateTimeString(),
        ];
    }
}
