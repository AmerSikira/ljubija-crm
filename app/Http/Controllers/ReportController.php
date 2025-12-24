<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();

        $reports = Report::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($sub) use ($search) {
                    $sub->where('protocol_number', 'like', '%' . $search . '%')
                        ->orWhere('location', 'like', '%' . $search . '%')
                        ->orWhere('chairperson', 'like', '%' . $search . '%')
                        ->orWhere('recorder', 'like', '%' . $search . '%');
                });
            })
            ->orderByDesc('meeting_datetime')
            ->get([
                'id',
                'protocol_number',
                'meeting_datetime',
                'location',
                'chairperson',
                'quorum_note',
            ]);

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeAdmin($request);

        return Inertia::render('reports/create');
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $this->validateReport($request);

        Report::create($validated + [
            'created_by' => $request->user()?->id,
        ]);

        return redirect()->route('reports.index')->with('success', 'Zapisnik je kreiran.');
    }

    public function show(Report $report)
    {
        $report->load('creator:id,name');

        return Inertia::render('reports/show', [
            'report' => $report,
        ]);
    }

    public function edit(Request $request, Report $report)
    {
        $this->authorizeAdmin($request);
        $report->load('creator:id,name');

        return Inertia::render('reports/edit', [
            'report' => $report,
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $this->authorizeAdmin($request);

        $validated = $this->validateReport($request);
        $report->update($validated);

        return redirect()->route('reports.index')->with('success', 'Zapisnik je ažuriran.');
    }

    public function destroy(Request $request, Report $report)
    {
        $this->authorizeAdmin($request);
        $report->delete();

        return redirect()->route('reports.index')->with('success', 'Zapisnik je obrisan.');
    }

    private function validateReport(Request $request): array
    {
        $validated = $request->validate([
            'protocol_number' => 'required|string|max:50',
            'meeting_datetime' => 'required|date',
            'location' => 'nullable|string|max:255',
            'recorder' => 'nullable|string|max:255',
            'verifier_one' => 'nullable|string|max:255',
            'verifier_two' => 'nullable|string|max:255',
            'chairperson' => 'nullable|string|max:255',
            'board_members' => 'nullable|string',
            'attendees_count' => 'nullable|integer|min:0',
            'quorum_note' => 'nullable|string|max:255',
            'agenda' => 'nullable|array',
            'agenda.*' => 'nullable|string|max:500',
            'digital_votes' => 'nullable|string',
            'urgent_consultations' => 'nullable|string',
            'discussion' => 'nullable|string',
            'decisions' => 'nullable|array',
            'decisions.*.title' => 'required_with:decisions|string|max:255',
            'decisions.*.description' => 'nullable|string',
            'decisions.*.votes_for' => 'nullable|integer|min:0',
            'decisions.*.votes_against' => 'nullable|integer|min:0',
            'decisions.*.votes_abstained' => 'nullable|integer|min:0',
            'decisions.*.voting_method' => 'nullable|string|max:50',
            'ended_at' => 'nullable|date_format:H:i',
            'attendance_notes' => 'nullable|string',
        ], [
            'protocol_number.required' => 'Broj protokola je obavezan.',
            'meeting_datetime.required' => 'Datum i vrijeme sjednice su obavezni.',
            'meeting_datetime.date' => 'Unesite ispravan datum i vrijeme.',
            'agenda.array' => 'Dnevni red mora biti lista stavki.',
            'decisions.array' => 'Odluke moraju biti u listi.',
            'decisions.*.title.required_with' => 'Svaka odluka mora imati naslov ili broj.',
        ]);

        $validated['agenda'] = isset($validated['agenda'])
            ? collect($validated['agenda'])->filter(fn ($item) => filled($item))->values()->all()
            : null;

        if (isset($validated['decisions'])) {
            $validated['decisions'] = collect($validated['decisions'])
                ->map(function ($decision) {
                    return [
                        'title' => $decision['title'] ?? null,
                        'description' => $decision['description'] ?? null,
                        'votes_for' => $decision['votes_for'] ?? null,
                        'votes_against' => $decision['votes_against'] ?? null,
                        'votes_abstained' => $decision['votes_abstained'] ?? null,
                        'voting_method' => $decision['voting_method'] ?? null,
                    ];
                })
                ->filter(fn ($decision) => filled($decision['title']) || filled($decision['description']))
                ->values()
                ->all();
        }

        return $validated;
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }
}
