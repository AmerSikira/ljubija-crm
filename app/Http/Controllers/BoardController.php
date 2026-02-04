<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardMember;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

/**
 * Manages džemat board compositions, history, and membership assignments.
 */
class BoardController extends Controller
{
    private array $roleLabels = [
        'president' => 'Predsjednik',
        'vice_president' => 'Potpredsjednik',
        'finance' => 'Finansije',
        'member' => 'Član',
    ];

    /**
     * Only admins/managers can create or edit boards.
     */
    private function authorizeBoardManager(Request $request): void
    {
        $role = $request->user()?->role;
        if (!in_array($role, ['admin', 'manager'])) {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    /**
     * Show current board and history with member assignments.
     */
    public function index(Request $request)
    {
        $currentBoard = Board::with(['members.member'])
            ->where('is_current', true)
            ->first();

        if (!$currentBoard) {
            $currentBoard = Board::with(['members.member'])
                ->orderByDesc('start_date')
                ->first();
        }

        $historyBoards = Board::with(['members.member'])
            ->when($currentBoard, fn ($q) => $q->where('id', '!=', $currentBoard->id))
            ->orderByDesc('start_date')
            ->get();

        return Inertia::render('boards/index', [
            'currentBoard' => $currentBoard ? $this->transformBoard($currentBoard) : null,
            'historyBoards' => $historyBoards->map(fn (Board $board) => $this->transformBoard($board)),
            'roleLabels' => $this->roleLabels,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeBoardManager($request);

        $members = Member::orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'title', 'email'])
            ->map(function (Member $member) {
                $fullName = trim(($member->title ? $member->title . ' ' : '') . ($member->first_name ?? '') . ' ' . ($member->last_name ?? ''));
                return [
                    'id' => $member->id,
                    'name' => $fullName ?: $member->email,
                    'email' => $member->email,
                ];
            });

        return Inertia::render('boards/create', [
            'members' => $members,
            'roleLabels' => $this->roleLabels,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeBoardManager($request);

        $validated = $request->validate([
            'start_date' => 'required|string',
            'end_date' => 'nullable|string',
            'is_current' => 'boolean',
            'roles.president' => 'nullable|integer|exists:members,id',
            'roles.president_name' => 'nullable|string|max:255',
            'roles.vice_president' => 'nullable|integer|exists:members,id',
            'roles.vice_president_name' => 'nullable|string|max:255',
            'roles.finance' => 'nullable|integer|exists:members,id',
            'roles.finance_name' => 'nullable|string|max:255',
            'roles.members' => 'array',
            'roles.members.*' => 'integer|exists:members,id',
            'roles.external_members' => 'array',
            'roles.external_members.*' => 'string|max:255',
        ]);

        $startDate = $this->parseDate($validated['start_date']);
        $endDate = $this->parseDate($validated['end_date'] ?? null);

        if (!$startDate) {
            return back()->with('error', 'Datum početka mandata je obavezan.')->withInput();
        }

        $board = Board::create([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_current' => (bool) ($validated['is_current'] ?? false),
        ]);

        if ($board->is_current) {
            Board::where('id', '!=', $board->id)->update(['is_current' => false]);
        }

        $this->syncBoardMembers($board, $validated['roles'] ?? []);

        return redirect()->route('boards.index')->with('success', 'Odbor je kreiran.');
    }

    public function edit(Request $request, Board $board)
    {
        $this->authorizeBoardManager($request);

        $board->load('members.member');

        if (!$board->is_current) {
            return redirect()->route('boards.index')->with('error', 'Možete uređivati samo aktuelni odbor.');
        }

        $members = Member::orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'title', 'email'])
            ->map(function (Member $member) {
                $fullName = trim(($member->title ? $member->title . ' ' : '') . ($member->first_name ?? '') . ' ' . ($member->last_name ?? ''));
                return [
                    'id' => $member->id,
                    'name' => $fullName ?: $member->email,
                    'email' => $member->email,
                ];
            });

        $president = $board->members->firstWhere('role', 'president');
        $vice = $board->members->firstWhere('role', 'vice_president');
        $finance = $board->members->firstWhere('role', 'finance');
        $memberEntries = $board->members->where('role', 'member')->values();

        $roles = [
            'president' => $president?->member_id,
            'president_name' => $president?->external_name,
            'vice_president' => $vice?->member_id,
            'vice_president_name' => $vice?->external_name,
            'finance' => $finance?->member_id,
            'finance_name' => $finance?->external_name,
            'members' => $memberEntries->pluck('member_id')->filter()->values()->all(),
            'external_members' => $memberEntries->pluck('external_name')->filter()->values()->all(),
        ];

        return Inertia::render('boards/edit', [
            'board' => [
                'id' => $board->id,
                'start_date' => $board->start_date?->format('d.m.Y'),
                'end_date' => $board->end_date?->format('d.m.Y'),
                'is_current' => $board->is_current,
                'roles' => $roles,
            ],
            'members' => $members,
            'roleLabels' => $this->roleLabels,
        ]);
    }

    public function update(Request $request, Board $board)
    {
        $this->authorizeBoardManager($request);

        if (!$board->is_current) {
            return redirect()->route('boards.index')->with('error', 'Možete uređivati samo aktuelni odbor.');
        }

        $validated = $request->validate([
            'start_date' => 'required|string',
            'end_date' => 'nullable|string',
            'is_current' => 'boolean',
            'roles.president' => 'nullable|integer|exists:members,id',
            'roles.president_name' => 'nullable|string|max:255',
            'roles.vice_president' => 'nullable|integer|exists:members,id',
            'roles.vice_president_name' => 'nullable|string|max:255',
            'roles.finance' => 'nullable|integer|exists:members,id',
            'roles.finance_name' => 'nullable|string|max:255',
            'roles.members' => 'array',
            'roles.members.*' => 'integer|exists:members,id',
            'roles.external_members' => 'array',
            'roles.external_members.*' => 'string|max:255',
        ]);

        $startDate = $this->parseDate($validated['start_date']);
        $endDate = $this->parseDate($validated['end_date'] ?? null);

        if (!$startDate) {
            return back()->with('error', 'Datum početka mandata je obavezan.')->withInput();
        }

        $board->update([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_current' => (bool) ($validated['is_current'] ?? false),
        ]);

        if ($board->is_current) {
            Board::where('id', '!=', $board->id)->update(['is_current' => false]);
        }

        $this->syncBoardMembers($board, $validated['roles'] ?? []);

        return redirect()->route('boards.index')->with('success', 'Odbor je ažuriran.');
    }

    private function transformBoard(Board $board): array
    {
        return [
            'id' => $board->id,
            'start_date' => $board->start_date?->format('d.m.Y'),
            'end_date' => $board->end_date?->format('d.m.Y'),
            'is_current' => (bool) $board->is_current,
            'members' => $board->members->map(function ($boardMember) {
                $member = $boardMember->member;
                $fullName = $member
                    ? trim(($member->first_name ?? '') . ' ' . ($member->last_name ?? '')) ?: $member->email
                    : ($boardMember->external_name ?? '');
                return [
                    'id' => $boardMember->id,
                    'role' => $boardMember->role,
                    'role_label' => $this->roleLabels[$boardMember->role] ?? $boardMember->role,
                    'member' => [
                        'id' => $member?->id,
                        'name' => $fullName,
                        'email' => $member?->email,
                        'phone' => $member?->phone,
                    ],
                ];
            }),
        ];
    }

    private function parseDate(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        try {
            return Carbon::createFromFormat('d.m.Y', $value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    private function syncBoardMembers(Board $board, array $roles): void
    {
        $board->members()->delete();

        $singleRoles = ['president', 'vice_president', 'finance'];
        foreach ($singleRoles as $role) {
            $nameKey = "{$role}_name";
            if (!empty($roles[$nameKey])) {
                BoardMember::create([
                    'board_id' => $board->id,
                    'member_id' => null,
                    'external_name' => $roles[$nameKey],
                    'role' => $role,
                ]);
                continue;
            }
            if (!empty($roles[$role])) {
                BoardMember::create([
                    'board_id' => $board->id,
                    'member_id' => $roles[$role],
                    'role' => $role,
                ]);
            }
        }

        foreach ($roles['members'] ?? [] as $memberId) {
            BoardMember::create([
                'board_id' => $board->id,
                'member_id' => $memberId,
                'role' => 'member',
            ]);
        }

        foreach ($roles['external_members'] ?? [] as $name) {
            if (!trim((string) $name)) {
                continue;
            }
            BoardMember::create([
                'board_id' => $board->id,
                'member_id' => null,
                'external_name' => $name,
                'role' => 'member',
            ]);
        }
    }
}
