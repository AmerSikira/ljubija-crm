<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

/**
 * Handles CRUD operations for news articles including media handling.
 */
class ArticleController extends Controller
{
    /**
     * List articles with preview image for the dashboard/table.
     */
    public function index ()
    {
        $articles = Article::with('media')->get()
        ->map(function (Article $article) {
            return [
                'id'         => $article->id,
                'title'      => $article->title,
                'intro'      => $article->intro,
                'main_text'  => $article->main_text,
                // change 'images' to your media collection if needed
                'image_url'  => $article->getFirstMediaUrl('images', 'preview'),
            ];
        });

        
        return inertia('articles/index', ['articles' => $articles]);
    }
    //
    public function create ()
    {
        return inertia('articles/create');
    }

    public function store (Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'intro' => 'required|string',
            'main_text' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        
        // Store article logic here...
            $article = \App\Models\Article::create([
                'title' => $validated['title'],
                'intro' => $validated['intro'],
                'main_text' => $validated['main_text'],
            ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $article
                    ->addMedia($image)
                    ->toMediaCollection('images');
            }}

        return redirect()->route('articles');
    }


    public function edit (Article $article)
    {
        $article->load('media');

        return inertia('articles/edit', [
            'article' => [
                'id'         => $article->id,
                'title'      => $article->title,
                'intro'      => $article->intro,
                'main_text'  => $article->main_text,
                'image_url'  => $article->getFirstMediaUrl('images'),
                'gallery' => $article->getMedia('images')->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->getUrl(),
                    ];
                }),
            ],
        ]);
    }

    public function update (Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'intro' => 'required|string',
            'main_text' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'removed_media_ids' => 'array',
            'removed_media_ids.*' => 'integer',
        ]);

        $article->update([
            'title' => $validated['title'],
            'intro' => $validated['intro'],
            'main_text' => $validated['main_text'],
        ]);

        if (!empty($validated['removed_media_ids'])) {
            $article->media()->whereIn('id', $validated['removed_media_ids'])->get()->each->delete();
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $article
                    ->addMedia($image)
                    ->toMediaCollection('images');
            }
        }

        return redirect()->route('articles');
    }

    public function show(Article $article)
    {
        $article->load('media');

        return inertia('articles/show', [
            'article' => [
                'id'         => $article->id,
                'title'      => $article->title,
                'intro'      => $article->intro,
                'main_text'  => $article->main_text,
                'image_url'  => $article->getFirstMediaUrl('images'),
                'gallery_urls' => $article->getMedia('images')->map->getUrl()->values()->all(),
            ],
        ]);
    }

    public function destroy(Request $request, Article $article)
    {
        $this->authorizeAdmin($request);
        $article->clearMediaCollection('images');
        $article->delete();

        return redirect()->route('articles')->with('success', 'Vijest je obrisana.');
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }
}
