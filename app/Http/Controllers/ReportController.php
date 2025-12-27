<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Member;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();

        $reports = Report::query()
            ->with(['chairperson'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($sub) use ($search) {
                    $sub->where('protocol_number', 'like', '%' . $search . '%')
                        ->orWhere('location', 'like', '%' . $search . '%')
                        ->orWhereHas('chairperson', function ($chairQuery) use ($search) {
                            $chairQuery->where('first_name', 'like', '%' . $search . '%')
                                ->orWhere('last_name', 'like', '%' . $search . '%');
                        })
                        ->orWhereHas('recorder', function ($recorderQuery) use ($search) {
                            $recorderQuery->where('first_name', 'like', '%' . $search . '%')
                                ->orWhere('last_name', 'like', '%' . $search . '%');
                        });
                });
            })
            ->orderByDesc('meeting_datetime')
            ->get()
            ->map(function (Report $report) {
                return [
                    'id' => $report->id,
                    'protocol_number' => $report->protocol_number,
                    'meeting_datetime' => $report->meeting_datetime?->toISOString(),
                    'location' => $report->location,
                    'chairperson_name' => $report->chairperson ? $this->formatMemberName($report->chairperson) : null,
                    'quorum_note' => $report->quorum_note,
                ];
            });

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

        return Inertia::render('reports/create', [
            'boardMembers' => $this->boardMemberOptions(),
        ]);
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
        $report->load(['creator:id,name', 'recorder', 'verifierOne', 'verifierTwo', 'chairperson']);

        return Inertia::render('reports/edit', [
            'report' => [
                'id' => $report->id,
                'protocol_number' => $report->protocol_number,
                'meeting_datetime' => $report->meeting_datetime?->format('Y-m-d\TH:i'),
                'location' => $report->location,
                'recorder_id' => $report->recorder_id,
                'verifier_one_id' => $report->verifier_one_id,
                'verifier_two_id' => $report->verifier_two_id,
                'chairperson_id' => $report->chairperson_id,
                'board_members' => $report->board_members ?? [],
                'attendees_count' => $report->attendees_count,
                'quorum_note' => $report->quorum_note,
                'agenda' => $report->agenda ?? [],
                'digital_votes' => $report->digital_votes,
                'urgent_consultations' => $report->urgent_consultations,
                'discussion' => $report->discussion,
                'decisions' => $report->decisions ?? [],
                'ended_at' => $report->ended_at?->format('H:i'),
                'attendance_notes' => $report->attendance_notes,
            ],
            'boardMembers' => $this->boardMemberOptions(),
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
            'recorder_id' => 'nullable|integer|exists:members,id',
            'verifier_one_id' => 'nullable|integer|exists:members,id',
            'verifier_two_id' => 'nullable|integer|exists:members,id',
            'chairperson_id' => 'nullable|integer|exists:members,id',
            'board_members' => 'nullable|array',
            'board_members.*' => 'integer|exists:members,id',
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

        $validated['board_members'] = isset($validated['board_members'])
            ? collect($validated['board_members'])->filter()->unique()->values()->all()
            : [];

        return $validated;
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    private function boardMemberOptions(): array
    {
        $board = Board::with(['members.member'])
            ->where('is_current', true)
            ->first();

        if (!$board) {
            $board = Board::with(['members.member'])
                ->orderByDesc('start_date')
                ->first();
        }

        if (!$board) {
            return [];
        }

        return $board->members
            ->pluck('member')
            ->filter()
            ->unique('id')
            ->map(function (Member $member) {
                return [
                    'id' => $member->id,
                    'name' => $this->formatMemberName($member),
                    'email' => $member->email,
                ];
            })
            ->values()
            ->all();
    }

    private function formatMemberName(Member|string|null $member): string
    {
        if ($member instanceof Member) {
            $fullName = trim(($member->title ? $member->title . ' ' : '') . ($member->first_name ?? '') . ' ' . ($member->last_name ?? ''));
            return $fullName ?: ($member->email ?? 'Član #' . $member->id);
        }

        return is_string($member) ? trim($member) : '';
    }
}
