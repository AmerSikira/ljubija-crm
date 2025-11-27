<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;

class DashboardController extends Controller
{
    //

    public function index() {
        $articles = Article::with('media')->latest()->take(5)->get()->map(function (Article $article) {
            return [
                'id'         => $article->id,
                'title'      => $article->title,
                'intro'      => $article->intro,
                'main_text'  => $article->main_text,
                // change 'images' to your media collection if needed
                'image_url'  => $article->getFirstMediaUrl('images', 'preview'),
            ];
        });

        //load images 

        return inertia('dashboard', [
            'articles' => $articles,
        ]);
    }
}
