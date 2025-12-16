<?php

namespace App\Http\Controllers;

use App\Models\ContentItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ContentItemController extends Controller
{
    private array $typeLabels = [
        'dova' => 'Dova',
        'hadis' => 'Hadis',
    ];

    public function index(Request $request)
    {
        $items = ContentItem::orderByDesc('created_at')
            ->get()
            ->map(fn (ContentItem $item) => $this->transformItem($item, true));

        return Inertia::render('content/index', [
            'items' => $items,
            'typeLabels' => $this->typeLabels,
        ]);
    }

    public function show(ContentItem $contentItem)
    {
        return Inertia::render('content/show', [
            'item' => $this->transformItem($contentItem),
            'typeLabels' => $this->typeLabels,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeAdmin($request);

        return Inertia::render('content/create', [
            'typeLabels' => $this->typeLabels,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);

        ContentItem::create($data);

        return redirect()->route('content-items.index')->with('success', 'Uspješno dodano.');
    }

    public function edit(Request $request, ContentItem $contentItem)
    {
        $this->authorizeAdmin($request);

        return Inertia::render('content/edit', [
            'item' => $this->transformItem($contentItem),
            'typeLabels' => $this->typeLabels,
        ]);
    }

    public function update(Request $request, ContentItem $contentItem)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);

        $contentItem->update($data);

        return redirect()->route('content-items.index')->with('success', 'Uspješno izmijenjeno.');
    }

    private function authorizeAdmin(Request $request): void
    {
        $role = $request->user()?->role;
        if ($role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    private function validateData(Request $request): array
    {
        return $request->validate(
            [
                'title' => 'required|string|max:255',
                'type' => 'required|in:dova,hadis',
                'description' => 'required|string',
            ],
            [
                'title.required' => 'Naslov je obavezan.',
                'type.required' => 'Tip je obavezan.',
                'type.in' => 'Tip mora biti Dova ili Hadis.',
                'description.required' => 'Opis je obavezan.',
            ]
        );
    }

    private function transformItem(ContentItem $item, bool $withPreview = false): array
    {
        return [
            'id' => $item->id,
            'title' => $item->title,
            'type' => $item->type,
            'type_label' => $this->typeLabels[$item->type] ?? $item->type,
            'description' => $item->description,
            'description_preview' => $withPreview ? Str::limit($item->description, 180, '...') : null,
            'created_at' => $item->created_at,
        ];
    }
}
