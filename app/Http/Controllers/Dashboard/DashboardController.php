<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $revenueRanges = [
            '6m' => $this->getMonthlyRevenue(6),
            '12m' => $this->getMonthlyRevenue(12),
        ];

        return Inertia::render('dashboard', [
            'revenueRanges' => $revenueRanges,
        ]);
    }

    private function getMonthlyRevenue(int $months): array
    {
        $now = now();

        $startDate = $now->copy()
            ->startOfMonth()
            ->subMonths($months - 1);

        $endDate = $now->copy()->endOfMonth();

        // Get actual payments received during this period.
        $payments = Payment::query()
            ->whereBetween('paid_at', [
                $startDate,
                $endDate,
            ])
            ->get(['amount', 'paid_at']);

        // Group payments by year and month.
        $monthlyTotals = $payments
            ->groupBy(function ($payment) {
                return Carbon::parse($payment->paid_at)
                    ->format('Y-m');
            })
            ->map(function ($monthPayments) {
                return (float) $monthPayments->sum('amount');
            });

        // Generate all months, including zero-revenue months.
        $labels = [];
        $values = [];

        for ($i = 0; $i < $months; $i++) {
            $month = $startDate->copy()->addMonths($i);

            $monthKey = $month->format('Y-m');

            $labels[] = $month->format('M');

            $values[] = round(
                (float) $monthlyTotals->get($monthKey, 0),
                2
            );
        }

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }
}
