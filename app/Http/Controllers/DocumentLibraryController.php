<?php

namespace App\Http\Controllers;

use App\Models\DzematPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Admin-managed document library with upload/delete and shareable URLs.
 */
class DocumentLibraryController extends Controller
{
    public function index(Request $request)
    {
        $page = DzematPage::with('media')->first();

        $documents = $page
            ? $page->getMedia('documents')
                ->sortByDesc(fn (Media $media) => $media->created_at)
                ->values()
                ->map(function (Media $media) {
                    return [
                        'id' => $media->id,
                        'name' => $media->name ?: $media->file_name,
                        'file_name' => $media->file_name,
                        'mime_type' => $media->mime_type,
                        'size' => $media->size,
                        'url' => $media->getUrl(),
                        'full_url' => $media->getFullUrl(),
                        'created_at' => $media->created_at?->toDateTimeString(),
                    ];
                })
                ->all()
            : [];

        return Inertia::render('documents/index', [
            'documents' => $documents,
            'isAdmin' => $request->user()?->role === 'admin',
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'document' => 'nullable|file|max:65536',
            'documents' => 'nullable|array|min:1',
            'documents.*' => 'file|max:65536',
        ]);

        $page = $this->ensureLibraryRoot();
        $files = [];

        if ($request->hasFile('documents')) {
            /** @var array<int, UploadedFile> $uploaded */
            $uploaded = $request->file('documents');
            $files = $uploaded;
        } elseif ($request->hasFile('document')) {
            /** @var UploadedFile $uploaded */
            $uploaded = $request->file('document');
            $files = [$uploaded];
        }

        if (empty($files)) {
            return redirect()->route('documents.index')->withErrors([
                'documents' => 'Odaberite barem jedan dokument za upload.',
            ]);
        }

        $multiple = count($files) > 1;
        foreach ($files as $index => $file) {
            $mediaAdder = $page->addMedia($file);

            if (!empty($data['name'])) {
                $name = $multiple ? $data['name'].' #'.($index + 1) : $data['name'];
                $mediaAdder->usingName($name);
            }

            $mediaAdder->toMediaCollection('documents');
        }

        return redirect()->route('documents.index')->with(
            'success',
            count($files) > 1 ? 'Dokumenti su uspješno dodani.' : 'Dokument je uspješno dodan.'
        );
    }

    public function destroy(Request $request, int $media)
    {
        $this->authorizeAdmin($request);

        $document = Media::query()
            ->whereKey($media)
            ->where('model_type', DzematPage::class)
            ->where('collection_name', 'documents')
            ->firstOrFail();

        $document->delete();

        return redirect()->route('documents.index')->with('success', 'Dokument je obrisan.');
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    private function ensureLibraryRoot(): DzematPage
    {
        return DzematPage::first() ?? DzematPage::create([
            'title' => 'Džemat Donja Ljubija',
            'content' => '',
        ]);
    }
}
