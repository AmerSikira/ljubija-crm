<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $expenses = Expense::query()
            ->with('creator:id,name')
            ->when($search !== '', function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderByDesc('paid_at')
            ->orderByDesc('id')
            ->get()
            ->map(function (Expense $expense) {
                return [
                    'id' => $expense->id,
                    'type' => $expense->type,
                    'title' => $expense->title,
                    'description' => $expense->description,
                    'amount' => $expense->amount,
                    'paid_at' => $expense->paid_at?->format('Y-m-d'),
                    'created_by' => $expense->creator?->name,
                ];
            });

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeManage($request);
        return Inertia::render('expenses/create', [
            'types' => self::expenseTypes(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeManage($request);
        $validated = $this->validateExpense($request);

        Expense::create($validated + [
            'created_by' => $request->user()?->id,
        ]);

        return redirect()->route('expenses.index')->with('success', 'Rashod je dodan.');
    }

    public function show(Expense $expense)
    {
        $expense->load('creator:id,name');
        return Inertia::render('expenses/show', [
            'expense' => [
                'id' => $expense->id,
                'type' => $expense->type,
                'title' => $expense->title,
                'description' => $expense->description,
                'amount' => $expense->amount,
                'paid_at' => $expense->paid_at?->format('Y-m-d'),
                'created_by' => $expense->creator?->name,
                'created_at' => $expense->created_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(Request $request, Expense $expense)
    {
        $this->authorizeManage($request);
        return Inertia::render('expenses/edit', [
            'expense' => [
                'id' => $expense->id,
                'type' => $expense->type,
                'title' => $expense->title,
                'description' => $expense->description,
                'amount' => $expense->amount,
                'paid_at' => $expense->paid_at?->format('Y-m-d'),
            ],
            'types' => self::expenseTypes(),
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $this->authorizeManage($request);
        $validated = $this->validateExpense($request);
        $expense->update($validated);

        return redirect()->route('expenses.index')->with('success', 'Rashod je ažuriran.');
    }

    public function destroy(Request $request, Expense $expense)
    {
        $this->authorizeManage($request);
        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Rashod je obrisan.');
    }

    private function validateExpense(Request $request): array
    {
        return $request->validate([
            'type' => 'required|string|in:' . implode(',', self::expenseTypes()),
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'paid_at' => 'required|date',
        ], [
            'type.required' => 'Vrsta rashoda je obavezna.',
            'title.required' => 'Naziv je obavezan.',
            'amount.required' => 'Iznos je obavezan.',
            'amount.numeric' => 'Iznos mora biti broj.',
            'paid_at.required' => 'Datum isplate je obavezan.',
        ]);
    }

    private function authorizeManage(Request $request): void
    {
        $role = $request->user()?->role;
        if (!in_array($role, ['admin', 'manager'])) {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    public static function expenseTypes(): array
    {
        return [
            'Plata za imama',
            'Bonus za imama',
            'Održavanje džamije',
            'Projekti',
            'Održavanje imamske kuće',
            'Održavanje džematskih prostorija',
            'Nabavka opreme',
        ];
    }
}
