<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payments;
use App\Models\User;
use App\Models\Member;
use Carbon\Carbon;

class PaymentsController extends Controller
{
    //

    protected function authorizeManager(Request $request)
    {
        $role = $request->user()?->role;
        if (!in_array($role, ['admin', 'manager'])) {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    public function index(Request $request) {
        $this->authorizeManager($request);
        $name = trim((string) $request->input('name', ''));
        $amountInput = trim((string) $request->input('amount', ''));
        $dateInput = trim((string) $request->input('date', ''));

        $payments = Payments::with('member')
            ->when($name !== '', function ($query) use ($name) {
                $query->whereHas('member', function ($memberQuery) use ($name) {
                    $memberQuery->where('first_name', 'like', "%{$name}%")
                        ->orWhere('last_name', 'like', "%{$name}%");
                });
            })
            ->when($amountInput !== '', function ($query) use ($amountInput) {
                $normalizedAmount = $this->normalizeAmount($amountInput);
                if ($normalizedAmount !== null) {
                    $query->where('amount', $normalizedAmount);
                }
            })
            ->when($dateInput !== '', function ($query) use ($dateInput) {
                $date = $this->parseDate($dateInput);
                if ($date) {
                    $query->whereDate('date_of_payment', $date)
                        ->orWhereDate('paid_from', $date)
                        ->orWhereDate('paid_to', $date);
                }
            })
            ->orderByDesc('date_of_payment')
            ->orderByDesc('id')
            ->paginate(20)
            ->appends($request->only(['name', 'amount', 'date']))
            ->through(function (Payments $payment) {
                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'type_of_payment' => $payment->type_of_payment,
                    'date_of_payment' => $payment->date_of_payment?->format('d/m/Y'),
                    'paid_from' => $payment->paid_from?->format('d/m/Y'),
                    'paid_to' => $payment->paid_to?->format('d/m/Y'),
                    'member' => [
                        'first_name' => $payment->member->first_name ?? '',
                        'last_name' => $payment->member->last_name ?? '',
                        'email' => $payment->member->email ?? null,
                        'phone' => $payment->member->phone ?? null,
                    ],
                ];
            });
        return Inertia::render('payments/index', [
            'payments' => $payments,
            'filters' => [
                'name' => $name,
                'amount' => $amountInput,
                'date' => $dateInput,
            ],
        ]);
    }

    public function create(Request $request, $memberId = null) {
        $this->authorizeManager($request);
        $members = Member::select('id', 'first_name', 'last_name')->get();
        // dd($members);
        if ($members->isEmpty()) {
        
            return redirect()->route('members.create')->with('error', 'Morate prvo dodati člana prije nego što možete dodati uplatu.');
        }
        // dd($users);
        return Inertia::render('payments/create', ['members' => $members, 'memberId' => $memberId]);
    }

    public function store(Request $request) {
        $this->authorizeManager($request);
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric|min:0',
            'type_of_payment' => 'required|string|max:255',
            'date_of_payment' => 'required|date_format:d/m/Y',
            'paid_from' => 'nullable|date_format:d/m/Y',
            'paid_to' => 'nullable|date_format:d/m/Y',
            'note' => 'nullable|string|max:1000',
        ], [
            'member_id.required' => 'Morate odabrati člana',
            'member_id.exists' => 'Odabrani član ne postoji',
            'amount.required' => 'Iznos je obavezan',
            'amount.numeric' => 'Iznos mora biti broj',
            'amount.min' => 'Iznos ne može biti negativan broj',
            'type_of_payment.required' => 'Vrsta uplate je obavezna',
            'type_of_payment.max' => 'Vrsta uplate ne može biti duža od 255 znakova',
            'date_of_payment.required' => 'Datum uplate je obavezan',
            'date_of_payment.date' => 'Datum uplate nije ispravan',
            'note.max' => 'Napomena ne može biti duža od 1000 znakova',
        ]);

        $payment = new Payments();
        $payment->member_id = $request->member_id;
        $payment->amount = $request->amount;
        $payment->type_of_payment = $request->type_of_payment;
        $payment->date_of_payment = $this->parseDate($request->date_of_payment);
        $payment->paid_from = $this->parseDate($request->paid_from);
        $payment->paid_to = $this->parseDate($request->paid_to);
        $payment->note = $request->note;
        $payment->save();

        return redirect()->route('payments')->with('success', 'Uplata je uspješno dodana.');
        //

     
    }

    public function edit(Request $request, $id) {
        $this->authorizeManager($request);
        $payment = Payments::findOrFail($id);
        $members = Member::select('id', 'first_name', 'last_name')->get();
        return Inertia::render('payments/edit', [
            'payment' => [
                'id' => $payment->id,
                'member_id' => $payment->member_id,
                'amount' => $payment->amount,
                'type_of_payment' => $payment->type_of_payment,
                'date_of_payment' => $payment->date_of_payment?->format('d/m/Y'),
                'paid_from' => $payment->paid_from?->format('d/m/Y'),
                'paid_to' => $payment->paid_to?->format('d/m/Y'),
                'note' => $payment->note,
            ],
            'members' => $members
        ]);

    }

    public function update(Request $request, $id) {
        $this->authorizeManager($request);
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric|min:0',
            'type_of_payment' => 'required|string|max:255',
            'date_of_payment' => 'required|date_format:d/m/Y',
            'paid_from' => 'nullable|date_format:d/m/Y',
            'paid_to' => 'nullable|date_format:d/m/Y',
            'note' => 'nullable|string|max:1000',
        ], [
            'member_id.required' => 'Morate odabrati člana',
            'member_id.exists' => 'Odabrani član ne postoji',
            'amount.required' => 'Iznos je obavezan',
            'amount.numeric' => 'Iznos mora biti broj',
            'amount.min' => 'Iznos ne može biti negativan broj',
            'type_of_payment.required' => 'Vrsta uplate je obavezna',
            'type_of_payment.max' => 'Vrsta uplate ne može biti duža od 255 znakova',
            'date_of_payment.required' => 'Datum uplate je obavezan',
            'date_of_payment.date' => 'Datum uplate nije ispravan',
            'note.max' => 'Napomena ne može biti duža od 1000 znakova',
        ]);

        $payment = Payments::findOrFail($id);
        $payment->member_id = $request->member_id;
        $payment->amount = $request->amount;
        $payment->type_of_payment = $request->type_of_payment;
        $payment->date_of_payment = $this->parseDate($request->date_of_payment);
        $payment->paid_from = $this->parseDate($request->paid_from);
        $payment->paid_to = $this->parseDate($request->paid_to);
        $payment->note = $request->note;
        $payment->save();

        return redirect()->route('payments')->with('success', 'Uplata je uspješno ažurirana.');

    }


    public function myPaymentsIndex(Request $request) {
        $user = $request->user();
        $member = Member::where('user_id', $user->id)->first();

        if (!$member) {
            return redirect()->route('dashboard')->with('error', 'Nemate pridruženog člana za pregled uplata.');
        }

        $payments = Payments::where('member_id', $member->id)->get();

        $payments = $payments->map(function (Payments $payment) {
            return [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'type_of_payment' => $payment->type_of_payment,
                'date_of_payment' => $payment->date_of_payment?->format('d/m/Y'),
                'paid_from' => $payment->paid_from?->format('d/m/Y'),
                'paid_to' => $payment->paid_to?->format('d/m/Y'),
            ];
        });

        return Inertia::render('my-payments/index', ['payments' => $payments]);
    }

    public function destroy(Request $request, Payments $payment)
    {
        $this->authorizeManager($request);
        $payment->delete();

        return redirect()->route('payments')->with('success', 'Uplata je obrisana.');
    }

    private function parseDate(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        try {
            if (str_contains($value, '/')) {
                return Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
            }
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    private function normalizeAmount(string $value): ?int
    {
        $normalized = str_replace(',', '.', $value);
        if (!is_numeric($normalized)) {
            return null;
        }

        return (int) round(((float) $normalized) * 100);
    }
}
