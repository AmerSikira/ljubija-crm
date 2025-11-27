<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
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
                'image_url'  => $article->getLastMediaUrl('images'),
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
        ]);

        $article->update([
            'title' => $validated['title'],
            'intro' => $validated['intro'],
            'main_text' => $validated['main_text'],
        ]);

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
                'image_url'  => $article->getLastMediaUrl('images'),
            ],
        ]);
    }
}
