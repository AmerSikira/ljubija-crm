<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollVote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PollController extends Controller
{
    public function index()
    {
        $polls = Poll::with([
            'items' => fn ($query) => $query->orderBy('id'),
            'creator:id,name',
        ])
            ->withCount('votes')
            ->latest()
            ->get();

        return Inertia::render('polls/index', ['polls' => $polls]);
    }

    public function create()
    {
        $this->authorizeManage();
        return Inertia::render('polls/create');
    }

    public function store(Request $request)
    {
        $this->authorizeManage();
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.title' => 'required|string|max:255',
            'finished_at' => 'nullable|date',
        ]);

        $poll = Poll::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'created_by' => $request->user()?->id,
            'finished_at' => $validated['finished_at'] ?? null,
        ]);

        $poll->items()->createMany(
            collect($validated['items'])->map(fn ($item) => ['title' => $item['title']])->all()
        );

        return redirect()->route('polls')->with('success', 'Anketa je kreirana.');
    }

    public function show(Poll $poll)
    {
        $poll->load([
            'items' => fn ($query) => $query->orderBy('id'),
            'creator:id,name',
        ])->loadCount(['items as items_count', 'votes']);

        return Inertia::render('polls/show', ['poll' => $poll]);
    }

    public function edit(Poll $poll)
    {
        $this->authorizeManage();
        $poll->load([
            'items' => fn ($query) => $query->orderBy('id'),
            'creator:id,name',
        ]);

        return Inertia::render('polls/edit', ['poll' => $poll]);
    }

    public function update(Request $request, Poll $poll)
    {
        $this->authorizeManage();
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.id' => 'nullable|exists:poll_items,id',
            'items.*.title' => 'required_with:items,items.*.id|string|max:255',
            'finish' => 'nullable|boolean',
        ]);

        if ($poll->finished_at) {
            return redirect()->route('polls')->with('error', 'Anketa je završena i ne može se mijenjati.');
        }

        $poll->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        if (isset($validated['items'])) {
            $keepIds = [];
            foreach ($validated['items'] as $itemData) {
                if (!empty($itemData['id'])) {
                    $pollItem = $poll->items()->findOrFail($itemData['id']);
                    $pollItem->update(['title' => $itemData['title']]);
                    $keepIds[] = $pollItem->id;
                    continue;
                }

                $newItem = $poll->items()->create(['title' => $itemData['title']]);
                $keepIds[] = $newItem->id;
            }

            $poll->items()->whereNotIn('id', $keepIds)->delete();
        }

        if ($request->boolean('finish')) {
            $poll->update(['finished_at' => now()]);
        }

        return redirect()->route('polls')->with('success', 'Anketa je ažurirana.');
    }

    public function destroy(Poll $poll)
    {
        $this->authorizeManage();
        if ($poll->finished_at) {
            return redirect()->route('polls')->with('error', 'Završenu anketu nije moguće obrisati.');
        }

        $poll->delete();

        return redirect()->route('polls')->with('success', 'Anketa je obrisana.');
    }

    public function vote(Request $request, Poll $poll)
    {
        if ($poll->finished_at) {
            return redirect()->route('polls.show', $poll)->with('error', 'Glasanje je završeno.');
        }

        $validated = $request->validate([
            'poll_item_id' => [
                'required',
                Rule::exists('poll_items', 'id')->where(function ($query) use ($poll) {
                    return $query->where('poll_id', $poll->id);
                }),
            ],
        ]);

        $userId = $request->user()->id;

        $alreadyVoted = PollVote::where('poll_id', $poll->id)
            ->where('user_id', $userId)
            ->exists();

        if ($alreadyVoted) {
            return redirect()->route('polls.show', $poll)->with('error', 'Već ste glasali na ovoj anketi.');
        }

        PollVote::create([
            'poll_id' => $poll->id,
            'poll_item_id' => $validated['poll_item_id'],
            'user_id' => $userId,
        ]);

        return redirect()->route('polls.show', $poll)->with('success', 'Glas je zaprimljen.');
    }

    private function authorizeManage(): void
    {
        $role = auth()->user()?->role;
        if (!in_array($role, ['admin', 'manager'])) {
            abort(403, 'Nedovoljno privilegija.');
        }
    }
}
