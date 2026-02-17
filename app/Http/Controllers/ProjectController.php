<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectInterest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Manages projects, their media, and user interests.
 */
class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::withCount('interests')
            ->orderByDesc('start_date')
            ->paginate(12)
            ->through(fn (Project $project) => $this->transformProject($project, true));

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    public function show(Request $request, Project $project)
    {
        $search = trim((string) $request->input('search', ''));
        $status = $request->input('status', '');

        $project->load('media');

        $interests = $project->interests()
            ->with('user')
            ->when($search !== '', function ($query) use ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($status === 'confirmed', fn ($q) => $q->whereNotNull('confirmed_at'))
            ->when($status === 'pending', fn ($q) => $q->whereNull('confirmed_at'))
            ->orderByRaw('CASE WHEN confirmed_at IS NULL THEN 1 ELSE 0 END')
            ->orderByDesc('confirmed_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (ProjectInterest $interest) => [
                'id' => $interest->id,
                'user' => [
                    'id' => $interest->user?->id,
                    'name' => $interest->user?->name,
                    'email' => $interest->user?->email,
                ],
                'confirmed_at' => $interest->confirmed_at,
            ]);

        $currentInterest = null;
        if ($request->user()) {
            $currentInterest = $project->interests()->where('user_id', $request->user()->id)->first();
        }

        return Inertia::render('projects/show', [
            'project' => $this->transformProject($project, false, true),
            'interests' => $interests,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'currentInterest' => $currentInterest ? [
                'id' => $currentInterest->id,
                'confirmed_at' => $currentInterest->confirmed_at,
            ] : null,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeAdmin($request);

        return Inertia::render('projects/create');
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);

        DB::transaction(function () use ($request, &$data) {
            $project = Project::create($data);
            $this->handleMedia($project, $request);
        });

        return redirect()->route('projects.index')->with('success', 'Projekat je dodat.');
    }

    public function edit(Request $request, Project $project)
    {
        $this->authorizeAdmin($request);

        $project->load('media');

        return Inertia::render('projects/edit', [
            'project' => $this->transformProject($project, false, true),
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorizeAdmin($request);

        $data = $this->validateData($request);

        DB::transaction(function () use ($request, $project, $data) {
            $project->update($data);
            $this->handleMedia($project, $request);
        });

        return redirect()->route('projects.index')->with('success', 'Projekat je ažuriran.');
    }

    public function destroy(Request $request, Project $project)
    {
        $this->authorizeAdmin($request);
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Projekat je obrisan.');
    }

    public function join(Request $request, Project $project)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('projects.show', $project)->with('error', 'Morate biti prijavljeni.');
        }

        ProjectInterest::firstOrCreate(
            ['project_id' => $project->id, 'user_id' => $user->id],
            ['confirmed_at' => null]
        );

        return back()->with('success', 'Prijavili ste interesovanje.');
    }

    public function confirmInterest(Request $request, Project $project, ProjectInterest $interest)
    {
        $this->authorizeAdmin($request);

        if ($interest->project_id !== $project->id) {
            abort(404);
        }

        $interest->update(['confirmed_at' => now()]);

        return back()->with('success', 'Interesovanje potvrđeno.');
    }

    public function destroyInterest(Request $request, Project $project, ProjectInterest $interest)
    {
        if ($interest->project_id !== $project->id) {
            abort(404);
        }

        $user = $request->user();
        if (!$user) {
            abort(403, 'Morate biti prijavljeni.');
        }

        $isAdmin = $user->role === 'admin';
        $isOwnPendingInterest = (int) $interest->user_id === (int) $user->id && $interest->confirmed_at === null;

        if (!$isAdmin && !$isOwnPendingInterest) {
            abort(403, 'Nedovoljno privilegija.');
        }

        $interest->delete();

        return back()->with('success', 'Interesovanje je uklonjeno.');
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
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'budget' => 'required|numeric|min:0',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date',
                'final_budget' => 'nullable|numeric|min:0',
                'completion_time' => 'nullable|string|max:255',
                'main_image' => 'nullable|image|max:4096',
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|image|max:4096',
            ],
            [
                'name.required' => 'Naziv je obavezan.',
                'description.required' => 'Opis je obavezan.',
                'budget.required' => 'Budžet je obavezan.',
                'start_date.required' => 'Početak projekta je obavezan.',
            ]
        );
    }

    private function handleMedia(Project $project, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $project->clearMediaCollection('main_image');
            $media = $project->addMediaFromRequest('main_image')->toMediaCollection('main_image');
            $project->update(['main_image' => $media->getUrl()]);
        }

        if ($request->hasFile('gallery')) {
            $project->clearMediaCollection('gallery');
            $urls = [];
            foreach ($request->file('gallery') as $file) {
                $media = $project->addMedia($file)->toMediaCollection('gallery');
                $urls[] = $media->getUrl();
            }
            $project->update(['gallery' => $urls]);
        }
    }

    private function transformProject(Project $project, bool $withPreview = false, bool $includeMedia = false): array
    {
        $project->loadMissing('media');

        return [
            'id' => $project->id,
            'name' => $project->name,
            'description' => $project->description,
            'description_preview' => $withPreview ? Str::limit($project->description, 180, '...') : null,
            'main_image_url' => $project->main_image_url,
            'gallery_urls' => $includeMedia ? $project->gallery_urls : [],
            'budget' => $project->budget,
            'start_date' => optional($project->start_date)?->format('d.m.Y'),
            'end_date' => optional($project->end_date)?->format('d.m.Y'),
            'final_budget' => $project->final_budget,
            'completion_time' => $project->completion_time,
            'interests_count' => $project->interests()->count(),
        ];
    }
}
