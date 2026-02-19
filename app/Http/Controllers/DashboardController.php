<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\ContentItem;

/**
 * Serves the main dashboard with recent articles and a random daily content item.
 */
class DashboardController extends Controller
{
    /**
     * Build dashboard props (news preview + daily content).
     */
    public function index() {
        $articles = Article::with('media')->latest()->take(5)->get()->map(function (Article $article) {
            return [
                'id'         => $article->id,
                'title'      => $article->title,
                'intro'      => $article->intro,
                'main_text'  => $article->main_text,
                'created_at' => $article->created_at?->toDateString(),
                // change 'images' to your media collection if needed
                'image_url'  => $article->getFirstMediaUrl('images', 'preview'),
            ];
        });

        //load images 

        return inertia('dashboard', [
            'articles' => $articles,
            'daily_content' => $this->randomContentItem(),
        ]);
    }

    /**
     * Pull a random dova/hadis to show as "uputa dana".
     */
    private function randomContentItem(): ?array
    {
        $item = ContentItem::inRandomOrder()->first();
        if (!$item) {
            return null;
        }

        return [
            'id' => $item->id,
            'title' => $item->title,
            'type' => $item->type,
            'type_label' => $item->type === 'dova' ? 'Dova' : 'Hadis',
            'description' => $item->description,
        ];
    }
}
