<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Payments;
use App\Models\Expense;
use App\Http\Controllers\ExpenseController;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

/**
 * Provides payment statistics for the current user and overall džemat.
 */
class StatsController extends Controller
{
    public function index(Request $request)
    {
        $startInput = $request->input('start_date');
        $endInput = $request->input('end_date');
        $typeInputRaw = $request->input('type', 'all');
        $typeFilter = $typeInputRaw === 'all' ? null : $typeInputRaw;
        $mode = $request->input('mode', 'payments');
        if (!in_array($mode, ['payments', 'expenses'], true)) {
            $mode = 'payments';
        }

        $startDate = $startInput ? Carbon::parse($startInput)->startOfDay() : Carbon::now()->startOfYear();
        $endDate = $endInput ? Carbon::parse($endInput)->endOfDay() : Carbon::now()->endOfDay();

        $user = $request->user();
        $memberId = Member::where('user_id', $user->id)->value('id');

        $userBreakdown = [];
        $userTotal = 0;
        $userPeriods = [];
        if ($memberId && $mode === 'payments') {
            $userPayments = Payments::query()
                ->where('member_id', $memberId)
                ->whereBetween('date_of_payment', [$startDate, $endDate])
                ->when($typeFilter, fn ($q) => $q->where('type_of_payment', $typeFilter))
                ->get(['type_of_payment', 'amount', 'date_of_payment']);

            $userBreakdown = $userPayments
                ->groupBy('type_of_payment')
                ->map(function ($group, $label) {
                    $sum = (int) $group->sum('amount');
                    return [
                        'label' => $label ?: 'Ostalo',
                        'amount' => $sum,
                    ];
                })
                ->values()
                ->all();
            $userTotal = collect($userBreakdown)->sum('amount');

            $userPeriods = $this->groupByPeriod($userPayments, $startDate, $endDate);
        }

        if ($mode === 'expenses') {
            $overallExpenses = Expense::query()
                ->whereBetween('paid_at', [$startDate, $endDate])
                ->when($typeFilter, fn ($q) => $q->where('type', $typeFilter))
                ->get(['type', 'amount', 'paid_at']);

            $overallBreakdown = $overallExpenses
                ->groupBy('type')
                ->map(function ($group, $label) {
                    $sum = (int) $group->sum('amount');
                    return [
                        'label' => $label ?: 'Rashod',
                        'amount' => $sum,
                    ];
                })
                ->values()
                ->all();

            $overallTotal = collect($overallBreakdown)->sum('amount');
            $overallPeriods = $this->groupByPeriod($overallExpenses, $startDate, $endDate, 'paid_at');
            $types = ExpenseController::expenseTypes();
        } else {
            $overallPayments = Payments::query()
                ->whereBetween('date_of_payment', [$startDate, $endDate])
                ->when($typeFilter, fn ($q) => $q->where('type_of_payment', $typeFilter))
                ->get(['type_of_payment', 'amount', 'date_of_payment']);

            $overallBreakdown = $overallPayments
                ->groupBy('type_of_payment')
                ->map(function ($group, $label) {
                    $sum = (int) $group->sum('amount');
                    return [
                        'label' => $label ?: 'Ostalo',
                        'amount' => $sum,
                    ];
                })
                ->values()
                ->all();

            $overallTotal = collect($overallBreakdown)->sum('amount');
            $overallPeriods = $this->groupByPeriod($overallPayments, $startDate, $endDate);

            $types = ['Članarina', 'Donacija', 'Vakuf', 'Sergija', 'Ostalo'];
        }

        return Inertia::render('stats/index', [
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'type' => $typeInputRaw ?: 'all',
                'mode' => $mode,
            ],
            'types' => $types,
            'mode' => $mode,
            'userBreakdown' => $userBreakdown,
            'userTotal' => $userTotal,
            'userPeriods' => $userPeriods,
            'overallBreakdown' => $overallBreakdown,
            'overallTotal' => $overallTotal,
            'overallPeriods' => $overallPeriods,
            'hasMember' => (bool) $memberId,
        ]);
    }

    private function groupByPeriod($items, Carbon $start, Carbon $end, string $dateField = 'date_of_payment'): array
    {
        $diffInDays = $start->diffInDays($end);
        $useYears = $diffInDays > 365;
        return $items
            ->groupBy(function ($item) use ($useYears, $dateField) {
                $date = Carbon::parse($item->{$dateField});
                return $useYears ? $date->format('Y') : $date->format('Y-m');
            })
            ->map(function ($group, $label) {
                $sum = (int) $group->sum('amount');
                return [
                    'period' => $label,
                    'total' => $sum,
                ];
            })
            ->sortBy('period')
            ->values()
            ->all();
    }
}
