<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Payments;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $startInput = $request->input('start_date');
        $endInput = $request->input('end_date');
        $typeInput = $request->input('type', '');

        $startDate = $startInput ? Carbon::parse($startInput)->startOfDay() : Carbon::now()->startOfYear();
        $endDate = $endInput ? Carbon::parse($endInput)->endOfDay() : Carbon::now()->endOfDay();

        $user = $request->user();
        $memberId = Member::where('user_id', $user->id)->value('id');

        $userBreakdown = [];
        $userTotal = 0;
        $userPeriods = [];
        if ($memberId) {
            $userPayments = Payments::query()
                ->where('member_id', $memberId)
                ->whereBetween('date_of_payment', [$startDate, $endDate])
                ->when($typeInput !== '', fn ($q) => $q->where('type_of_payment', $typeInput))
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

        $overallPayments = Payments::query()
            ->whereBetween('date_of_payment', [$startDate, $endDate])
            ->when($typeInput !== '', fn ($q) => $q->where('type_of_payment', $typeInput))
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

        return Inertia::render('stats/index', [
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'type' => $typeInput,
            ],
            'types' => $types,
            'userBreakdown' => $userBreakdown,
            'userTotal' => $userTotal,
            'userPeriods' => $userPeriods,
            'overallBreakdown' => $overallBreakdown,
            'overallTotal' => $overallTotal,
            'overallPeriods' => $overallPeriods,
            'hasMember' => (bool) $memberId,
        ]);
    }

    private function groupByPeriod($payments, Carbon $start, Carbon $end): array
    {
        $diffInDays = $start->diffInDays($end);
        $useYears = $diffInDays > 365;
        return $payments
            ->groupBy(function ($payment) use ($useYears) {
                $date = Carbon::parse($payment->date_of_payment);
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
