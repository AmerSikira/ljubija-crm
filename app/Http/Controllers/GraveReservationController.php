<?php

namespace App\Http\Controllers;

use App\Models\GraveReservation;
use App\Models\GraveSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GraveReservationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $letter = strtoupper(trim((string) $request->input('letter', '')));
        $number = $request->input('number');
        $status = $request->input('status'); // available | reserved | all

        $query = GraveSlot::query()->with(['activeReservation.user:id,name,email']);

        if ($letter !== '') {
            $query->where('letter', $letter);
        }

        if ($number) {
            $query->where('number', (int) $number);
        }

        if ($status === 'reserved') {
            $query->whereHas('activeReservation');
        } elseif ($status === 'available') {
            $query->whereDoesntHave('activeReservation');
        }

        $slots = $query
            ->orderBy('letter')
            ->orderBy('number')
            ->paginate(20)
            ->appends($request->only(['letter', 'number', 'status']));

        $rows = $slots->through(function (GraveSlot $slot) {
            $active = $slot->activeReservation;
            return [
                'id' => $slot->id,
                'letter' => $slot->letter,
                'number' => $slot->number,
                'status' => $active ? 'reserved' : 'available',
                'reservation' => $active ? [
                    'id' => $active->id,
                    'reserved_at' => $active->reserved_at?->toDateTimeString(),
                    'expires_at' => $active->expires_at?->toDateTimeString(),
                    'user' => $active->user ? [
                        'id' => $active->user->id,
                        'name' => $active->user->name ?? $active->user->email ?? 'Korisnik',
                    ] : null,
                ] : null,
            ];
        });

        $totalSlots = GraveSlot::count();
        $reservedCount = GraveSlot::whereHas('activeReservation')->count();

        return Inertia::render('graves/index', [
            'slots' => $rows,
            'filters' => [
                'letter' => $letter ?: null,
                'number' => $number ? (int) $number : null,
                'status' => $status ?: 'all',
            ],
            'stats' => [
                'total' => $totalSlots,
                'reserved' => $reservedCount,
                'available' => $totalSlots - $reservedCount,
            ],
            'canReserve' => $user?->role === 'admin',
        ]);
    }

    public function reserve(Request $request)
    {
        $user = $request->user();
        if ($user?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }

        $data = $request->validate([
            'slots' => 'required|array|min:1',
            'slots.*.letter' => ['required', 'string', 'size:1', 'regex:/^[A-Z]$/'],
            'slots.*.number' => 'required|integer|min:1|max:100',
            'expires_at' => 'nullable|date',
        ], [
            'slots.required' => 'Neispravno mjesto.',
            'slots.*.letter.regex' => 'Neispravno mjesto.',
            'slots.*.number.min' => 'Neispravno mjesto.',
            'slots.*.number.max' => 'Neispravno mjesto.',
        ]);

        $expiresAt = $data['expires_at'] ?? null;
        $success = [];
        $failed = [];

        foreach ($data['slots'] as $slotInput) {
            $letter = $slotInput['letter'];
            $number = (int) $slotInput['number'];

            $result = DB::transaction(function () use ($letter, $number, $user, $expiresAt) {
                $slot = GraveSlot::where('letter', $letter)
                    ->where('number', $number)
                    ->lockForUpdate()
                    ->first();

                if (!$slot) {
                    return ['status' => 'invalid'];
                }

                $activeExists = GraveReservation::where('grave_slot_id', $slot->id)
                    ->whereNull('removed_at')
                    ->where(function ($query) {
                        $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
                    })
                    ->lockForUpdate()
                    ->exists();

                if ($activeExists) {
                    return ['status' => 'reserved', 'slot' => $slot];
                }

                $reservation = GraveReservation::create([
                    'user_id' => $user->id,
                    'grave_slot_id' => $slot->id,
                    'reserved_at' => now(),
                    'expires_at' => $expiresAt,
                ]);

                return ['status' => 'ok', 'slot' => $slot, 'reservation' => $reservation];
            }, 3);

            if ($result['status'] === 'ok') {
                $success[] = [
                    'letter' => $letter,
                    'number' => $number,
                    'reservation_id' => $result['reservation']->id,
                ];
            } elseif ($result['status'] === 'reserved') {
                $failed[] = [
                    'letter' => $letter,
                    'number' => $number,
                    'reason' => 'Mjesto je već zauzeto.',
                ];
            } else {
                $failed[] = [
                    'letter' => $letter,
                    'number' => $number,
                    'reason' => 'Neispravno mjesto.',
                ];
            }
        }

        return back()->with('reservation_result', [
            'success' => $success,
            'failed' => $failed,
            'message' => count($failed) > 0
                ? 'Neka mjesta nisu mogla biti zauzeta.'
                : 'Zauzeće je uspješno sačuvano.',
        ]);
    }

    public function remove(Request $request, GraveReservation $reservation)
    {
        $user = $request->user();
        if ($user?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }

        $reservation->forceFill([
            'removed_at' => now(),
            'removed_by_user_id' => $user?->id,
            'remove_reason' => $request->input('reason'),
        ])->save();

        return back()->with('success', 'Zauzeće je uklonjeno.');
    }
}
